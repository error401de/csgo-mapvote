const { v4: uuidv4 } = require('uuid');

const createLobbyId = require('../createLobbyId');
const messageHandler = require('./messageHandler');
const getConnectionsByLobbyId = require('./getConnectionsByLobbyId');
const messageRateLimiter = require('./messageRateLimiter');

const defaultLobbyState = {
	id: '',
	adminId: '',
	votesPerParticipant: 1,
	vetosPerParticipant: 1
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
	getConnectionsByLobbyId(webSocketServer, ws.lobbyId).forEach(ws => ws.close(4504, 'Lobby Admin left'));
	state.delete(ws.lobbyId);

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

const checkLobbyId = (webSocketServer, lobbyId) => {
	const connections = getConnectionsByLobbyId(webSocketServer, lobbyId);

	if (connections.length === 0) {
		return { code: 4404, reason: 'Lobby ID Not Found' };
	}

	if (connections.length >= 5) {
		return { code: 4400, reason: 'Lobby Occupied' };
	}

	return null;
};

const initLobbyId = (webSocketServer, state, ws, req) => {
	const lobbyId = req.query.lobbyId ? req.query.lobbyId.toUpperCase() : null;
	if (!lobbyId) {
		ws.lobbyId = createLobbyId();
		state.set(ws.lobbyId, {
			...defaultLobbyState,
			id: ws.lobbyId,
			adminId: ws.id
		});
		console.log(`new admin ${ws.id} in lobby ${ws.lobbyId}`);

		return null;
	}

	const error = checkLobbyId(webSocketServer, lobbyId);

	if (error) {
		return error;
	}

	ws.lobbyId = lobbyId;

	return null;
};

const isLimitReached = webSocketServer => webSocketServer.getWss().clients.size > 10000;

module.exports = (webSocketServer) => {
	const state = new Map();
	const interval = setInterval(checkIsAlive.bind(null, webSocketServer, state), 30000);
	const wss = webSocketServer.getWss();

	wss.on('close', () => {
		clearInterval(interval);
	});

	return function (ws, req) {
		if (isLimitReached(webSocketServer)) {
			return ws.close(4001, 'Can not open new connections');
		}

		ws.id = uuidv4();
		ws.isAlive = true;
		ws.votes = [];
		ws.vetos = [];

		const error = initLobbyId(webSocketServer, state, ws, req);

		if (error) {
			return ws.close(error.code, error.reason);
		}

		ws.on('pong', heartbeat);
		ws.on('close', () => handleDeadConnection(webSocketServer, state, ws));
		ws.on('error', errorEvent => console.error(errorEvent));

		const lobbyState = state.get(ws.lobbyId);

		ws.on('message', msg => messageRateLimiter(ws, () => messageHandler.process(webSocketServer, lobbyState, ws, msg)));
		messageHandler.sendJson(ws, ['registered', { ack: true, id: ws.id, isAdmin: ws.id === lobbyState.adminId, lobbyId: ws.lobbyId }]);
		messageHandler.updateParticipants(webSocketServer, ws.lobbyId);
		messageHandler.updateSettings(ws, state.get(ws.lobbyId));
	};
};
