const { v4: uuidv4 } = require('uuid');

const messageHandler = require('./messageHandler');
const getConnectionsByLobbyId = require('./getConnectionsByLobbyId');
const messageRateLimiter = require('./messageRateLimiter');
const { GAME_MODES } = require('../lib/constants');
const createDebouncedSaveLobbyStatistics = require('../db/createDebouncedSaveLobbyStatistics');
const { SERVER_MESSAGES, ERROR_CODES } = require('../../../common/messageTypes');

const defaultLobbyState = {
	id: '',
	adminId: '',
	votesPerParticipant: 1,
	vetosPerParticipant: 1,
	gameModes: [GAME_MODES.COMPETITIVE]
};

function heartbeat() {
	this.isAlive = true;
};

const handleDeadConnection = (webSocketServer, state, ws) => {
	if (state.has(ws.lobbyId) && ws.id !== state.get(ws.lobbyId).adminId) {
		ws.terminate();
		messageHandler.updateParticipants(webSocketServer, ws.lobbyId);
		return false;
	}
	const connections = getConnectionsByLobbyId(webSocketServer, ws.lobbyId);
	const nextAdmin = connections[0];
	if (nextAdmin) {
		state.get(ws.lobbyId).adminId = nextAdmin.id;
		messageHandler.promoteToAdmin(nextAdmin);
		messageHandler.updateParticipants(webSocketServer, ws.lobbyId);
	} else {
		state.delete(ws.lobbyId);
	}

	return true
};

const checkIsAlive = (webSocketServer, state) => {
	const clients = webSocketServer.getWss().clients;
	console.log(`Executing ping for ${clients.size}`);
	for (let ws of clients) {
		if (ws.isAlive === false) {
			console.log(`ping for ${ws.id} failed, closing connection.`);

			if (handleDeadConnection(webSocketServer, state, ws)) {
				break;
			}
		}

		ws.isAlive = false;
		ws.ping(() => { });
	};
};

const checkLobbyId = (webSocketServer, state, lobbyId) => {
	if (!state.has(lobbyId)) {
		return { error: { code: ERROR_CODES.LOBBY_ID_NOT_FOUND, reason: 'Lobby ID Not Found' } };
	}
	const connections = getConnectionsByLobbyId(webSocketServer, lobbyId);

	if (connections.length >= 5) {
		return { error: { code: ERROR_CODES.LOBBY_LOCKED, reason: 'Lobby Occupied' } };
	}

	if (connections.length === 0) {
		return { isAdmin: true };
	}

	return {};
};

const initLobby = (webSocketServer, state, ws, req) => {
	const lobbyId = req.params.lobbyId ? req.params.lobbyId.toUpperCase() : null;

	const { error, isAdmin } = checkLobbyId(webSocketServer, state, lobbyId);

	if (error) {
		return error;
	}

	ws.lobbyId = lobbyId;

	if (isAdmin) {
		state.set(ws.lobbyId, {
			...defaultLobbyState,
			id: ws.lobbyId,
			adminId: ws.id
		});
		console.log(`new admin ${ws.id} in lobby ${ws.lobbyId}`);
	}

	return null;
};

const isLimitReached = webSocketServer => webSocketServer.getWss().clients.size > 10000;

module.exports = (webSocketServer, db, state) => {
	const interval = setInterval(checkIsAlive.bind(null, webSocketServer, state), 30000);
	const wss = webSocketServer.getWss();

	wss.on('close', () => {
		clearInterval(interval);
	});

	return function (ws, req) {
		if (isLimitReached(webSocketServer)) {
			return ws.close(ERROR_CODES.POOL_CLOSED, 'Can not open new connections');
		}

		ws.id = uuidv4();
		ws.isAlive = true;
		ws.votes = [];
		ws.vetos = [];
		ws.realIp = req.ip;

		const error = initLobby(webSocketServer, state, ws, req);

		if (error) {
			return ws.close(error.code, error.reason);
		}

		ws.on('pong', heartbeat);
		ws.on('close', () => handleDeadConnection(webSocketServer, state, ws));
		ws.on('error', errorEvent => console.error(errorEvent));

		const lobbyState = state.get(ws.lobbyId);

		ws.on('message', msg => messageRateLimiter(ws, () => messageHandler.process(webSocketServer, lobbyState, createDebouncedSaveLobbyStatistics(db), ws, msg)));
		messageHandler.sendJson(ws, [SERVER_MESSAGES.REGISTERED, { ack: true, id: ws.id, isAdmin: ws.id === lobbyState.adminId, lobbyId: ws.lobbyId }]);
		messageHandler.updateParticipants(webSocketServer, ws.lobbyId);
		messageHandler.updateSettings(ws, state.get(ws.lobbyId));
	};
};
