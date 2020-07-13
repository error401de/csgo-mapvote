const { v4: uuidv4 } = require('uuid');

const createLobbyId = require('../createLobbyId');
const messageHandler = require('./messageHandler');
const getConnectionsByLobbyId = require('../getConnectionsByLobbyId');

const defaultState = {
	adminId: '',
	lobbyId: '',
	votesPerParticipant: 1,
	vetosPerParticipant: 1
};

function heartbeat() {
	this.isAlive = true;
}

const handleDeadConnection = (webSocketServer, state, ws) => {
	if (state.has(ws.lobbyId) && ws.id !== state.get(ws.lobbyId).adminId) {
		ws.terminate();
		messageHandler.updateParticipants(webSocketServer, ws.lobbyId);
		return false;
	}
	getConnectionsByLobbyId(webSocketServer, ws.lobbyId).forEach(ws => ws.terminate());
	state.delete(ws.lobbyId);

	return true
}

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
}

const isLobbyIdValid = (webSocketServer, lobbyId) => {
	const connections = getConnectionsByLobbyId(webSocketServer, lobbyId);

	return connections.length > 0 && connections.length < 5;
};

const initLobbyId = (webSocketServer, state, ws, req) => {
	const lobbyId = req.query.lobbyId ? req.query.lobbyId.toUpperCase() : null;
	if (!lobbyId) {
		ws.lobbyId = createLobbyId();
		state.set(ws.lobbyId, {
			...defaultState,
			lobbyId: ws.lobbyId,
			adminId: ws.id
		});
		console.log(`new admin ${ws.id} in lobby ${ws.lobbyId}`);

		return { lobbyId: ws.lobbyId, isAdmin: true };
	} else if (isLobbyIdValid(webSocketServer, lobbyId)) {
		ws.lobbyId = lobbyId;

		return { lobbyId: ws.lobbyId, isAdmin: false };
	} else {
		console.log(`Rejecting invalid lobbyId ${lobbyId}`);

		return {};
	}
}

const isLimitReached = webSocketServer => webSocketServer.getWss().clients.size > 100;

module.exports = (webSocketServer) => {
	const state = new Map();
	const interval = setInterval(checkIsAlive.bind(null, webSocketServer, state), 30000);
	const wss = webSocketServer.getWss();

	wss.on('close', () => {
		clearInterval(interval);
	});

	return function (ws, req) {
		if (isLimitReached(webSocketServer)) {
			return ws.terminate();
		}

		ws.id = uuidv4();
		ws.isAlive = true;
		ws.votes = [];
		ws.vetos = [];
		ws.on('pong', heartbeat);

		const { lobbyId, isAdmin } = initLobbyId(webSocketServer, state, ws, req);

		if (!lobbyId) {
			return ws.terminate();
		}

		ws.on('close', () => handleDeadConnection(webSocketServer, state, ws));

		ws.on('message', messageHandler.process.bind(null, webSocketServer, state.get(ws.lobbyId), ws));
		messageHandler.updateParticipants(webSocketServer, ws.lobbyId);
		messageHandler.updateSettings(ws, state.get(ws.lobbyId));
		messageHandler.sendJson(ws, ['registered', { ack: true, id: ws.id, isAdmin, lobbyId: ws.lobbyId }]);
	}
}
