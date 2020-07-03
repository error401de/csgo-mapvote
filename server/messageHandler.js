const allMaps = require('../public/config/maps_competitive.json');

const sendJson = (ws, data) => {
	if (ws.readyState !== 1) {
		return console.error(`Trying to send ${data} to ${ws.id} with ready state ${ws.readyState}`);
	}
	ws.send(JSON.stringify(data))
};

const areMapsValid = maps => maps.every(mapId => allMaps.items.find(({ id }) => id === mapId));

const updateParticipants = (wss) => {
	const items = [];
	wss.clients.forEach(
		({ voted, vetoed }) => items.push({
			name: items.length + 1,
			voted,
			vetoed
		})
	);
	wss.clients.forEach(ws => sendJson(ws, ['participants', { items }]));
}

const publishResult = (wss) => {
	const items = [];
	wss.clients.forEach(
		({ votes, vetos }) => items.push({
			name: items.length + 1,
			votes,
			vetos
		})
	);
	wss.clients.forEach(ws => sendJson(ws, ['result', { items }]));
}

const handleMaps = (prop, ws, data, webSocketServer) => {
	ws[prop] = ws[prop].length ? ws[prop] : data.maps;
	updateParticipants(webSocketServer.getWss());
};

const process = (webSocketServer, state, ws, msg) => {
	try {
		const [msgType, data] = JSON.parse(msg);

		switch (msgType) {
			case 'show_result':
				if (ws.id !== state.adminId) {
					console.log(`${ws.id} tried to show result as non-admin`);
					break;
				}
				const wss = webSocketServer.getWss();
				updateParticipants(wss);
				publishResult(wss);

				break;
			case 'voted':
				if (!areMapsValid(data.maps) || ws.voted) {
					console.log(`${ws.id} tried to vote multiple times`);
					break;
				}
				ws.voted = true;
				handleMaps('votes', ws, data, webSocketServer);
				break;
			case 'vetoed':
				if (!areMapsValid(data.maps) || ws.vetoed) {
					console.log(`${ws.id} tried to veto multiple times`);
					break;
				}
				ws.vetoed = true;
				handleMaps('vetos', ws, data, webSocketServer);
				break;
			case 'reset':
				if (ws.id !== state.adminId) {
					console.log(`${ws.id} tried to reset as non-admin`);
					break;
				}
				webSocketServer.getWss().clients.forEach(ws => {
					ws.votes = [];
					ws.vetos = [];
					sendJson(ws, ['reset']);
				});
				break;
			default:
				console.log(`Unkown message ${msg} from ${ws.id}`);
				break;
		}
	} catch (err) {
		console.error(`Could not parse message ${msg}: `, err);
	}
};

module.exports = {
	process,
	updateParticipants,
	sendJson
}
