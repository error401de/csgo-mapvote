const { v4: uuidv4 } = require('uuid');

const createLobbyId = require('../createLobbyId');
const messageHandler = require('./messageHandler');

const defaultState = {
	adminId: '',
	lobbyId: '',
	votesPerParticipant: 1,
	vetosPerParticipant: 1
};

function heartbeat() {
	this.isAlive = true;
}

const checkIsAlive = (webSocketServer, state) => {
	for (let ws of webSocketServer.getWss().clients) {
		if (ws.isAlive === false) {
			console.log('closing socket');

			if (ws.id !== state.adminId) {
				ws.terminate();
				return messageHandler.updateParticipants(webSocketServer.getWss(), ws.lobbyId);
			}
			state.delete(ws.lobbyId);

			webSocketServer.getWss().clients.forEach((ws) => ws.terminate());
			break;
		}

		ws.isAlive = false;
		ws.ping(() => { });
	};
}

const isLobbyIdValid = (webSocketServer, lobbyId) => {
	let lobbyExists = false;
	let countParticipants = 0;
	webSocketServer.getWss().clients.forEach(ws => {
		if (ws.lobbyId === lobbyId) {
			lobbyExists = true;
			countParticipants++;
		}
	});

	return lobbyExists && countParticipants < 5;
};

const isLimitReached = webSocketServer => webSocketServer.getWss().clients.size > 100;

module.exports = (webSocketServer) => {
	const state = new Map();
	const interval = setInterval(checkIsAlive.bind(null, webSocketServer, state), 1000);
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
		const lobbyId = req.query.lobbyId ? req.query.lobbyId.toUpperCase() : null;

		if (!lobbyId) {
			ws.lobbyId = createLobbyId();
			state.set(ws.lobbyId, {
				...defaultState,
				adminId: ws.id
			});
			console.log(`new admin ${ws.id} in lobby ${ws.lobbyId}`);
		} else if (isLobbyIdValid(webSocketServer, lobbyId)) {
			ws.lobbyId = lobbyId;
		} else {
			console.log(`Rejecting invalid lobbyId ${lobbyId}`);
			return ws.terminate();
		}
		ws.on('close', () => {
			if (ws.id !== state.adminId) {
				ws.terminate();
				return messageHandler.updateParticipants(webSocketServer.getWss(), ws.lobbyId);
			}
			state.delete(ws.lobbyId);
			webSocketServer.getWss().clients.forEach((ws) => ws.lobbyId === ws.terminate());
		});

		ws.on('message', messageHandler.process.bind(null, webSocketServer, state.get(ws.lobbyId), ws));
		messageHandler.updateParticipants(wss, ws.lobbyId);
		messageHandler.updateSettings(webSocketServer, state.get(ws.lobbyId), ws.lobbyId);
		messageHandler.sendJson(ws, ['registered', { ack: true, id: ws.id, isAdmin: !lobbyId, lobbyId: ws.lobbyId }]);
	}
}
