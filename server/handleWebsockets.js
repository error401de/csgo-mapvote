const { v4: uuidv4 } = require('uuid');

const messageHandler = require('./messageHandler');

const defaultState = {
	adminId: ''
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
				return messageHandler.updateParticipants(webSocketServer.getWss());
			}

			webSocketServer.getWss().clients.forEach((ws) => ws.terminate());
			break;
		}

		ws.isAlive = false;
		ws.ping(() => { });
	};
}

const isFirstParticipant = (webSocketServer) => webSocketServer.getWss().clients.size === 1;

const isLimitReached = webSocketServer => webSocketServer.getWss().clients.size > 5;

module.exports = (webSocketServer) => {
	const state = {
		...defaultState
	};
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

		ws.on('message', messageHandler.process.bind(null, webSocketServer, state, ws));

		ws.on('close', () => {
			if (ws.id !== state.adminId) {
				ws.terminate();
				return messageHandler.updateParticipants(webSocketServer.getWss());
			}

			webSocketServer.getWss().clients.forEach((ws) => ws.terminate());
		});

		messageHandler.updateParticipants(wss);

		const shouldBecomeAdmin = isFirstParticipant(webSocketServer);

		if (shouldBecomeAdmin) {
			console.log(`new admin ${ws.id}`);
			state.adminId = ws.id;
		}
		messageHandler.sendJson(ws, ['registered', { ack: true, id: ws.id, isAdmin: shouldBecomeAdmin }]);
	}
}
