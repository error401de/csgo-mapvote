module.exports = (webSocketServer, lobbyIdToFind) => {
	const connections = [];
	webSocketServer.getWss().clients.forEach(ws => {
		if (ws.lobbyId === lobbyIdToFind) {
			connections.push(ws);
		}
	});

	return connections;
};
