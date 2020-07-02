function heartbeat() {
	this.isAlive = true;
}

const checkIsAlive = (webSocketServer) => {
	webSocketServer.getWss().clients.forEach(function each(ws) {
		if (ws.isAlive === false) {
			console.debug('closing socket');
			return ws.terminate();
		}

		ws.isAlive = false;
		ws.ping(() => { });
	});
}

module.exports = (webSocketServer) => {
	const interval = setInterval(checkIsAlive.bind(null, webSocketServer), 1000);

	webSocketServer.getWss().on('close', () => {
		clearInterval(interval);
	});

	return function (ws, req) {
		ws.isAlive = true;
		ws.on('pong', heartbeat);

		ws.on('message', function (msg) {
			console.log(`received ${msg}`);
		});
	}
}
