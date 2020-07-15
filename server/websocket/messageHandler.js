const allMaps = require('../../public/config/maps_competitive.json');
const getConnectionsByLobbyId = require('./getConnectionsByLobbyId');

const sendJson = (ws, data) => {
	const dataAsString = JSON.stringify(data);
	if (ws.readyState !== 1) {
		return console.error(`Trying to send ${dataAsString} to ${ws.id} with ready state ${ws.readyState}`);
	}
	ws.send(dataAsString)
};

const areMapsValid = maps => maps.every(mapId => allMaps.items.find(({ id }) => id === mapId));

const countMaps = allMaps.items.length;

const updateParticipants = (webSocketServer, lobbyId) => {
	const connections = getConnectionsByLobbyId(webSocketServer, lobbyId);
	const items = connections.map(({ voted, vetoed }, index) => ({
		name: `Player ${index + 1}`,
		voted,
		vetoed
	}));

	connections.forEach(ws => sendJson(ws, ['participants', { items }]));
}

const publishResult = (webSocketServer, lobbyId) => {
	const connections = getConnectionsByLobbyId(webSocketServer, lobbyId);
	const items = connections.map(({ votes, vetos }, index) => ({
		name: `Player ${index + 1}`,
		votes,
		vetos
	}));
	connections.forEach(ws => sendJson(ws, ['result', { items }]));
}

const handleMapChange = (webSocketServer, state, ws, validationProp, listProp, limitProp, data) => {
	if (data.maps.length > state[limitProp]) {
		console.log(`${ws.id} ${validationProp} more than ${state[limitProp]} maps: ${JSON.stringify(data)}`);
		return;
	}
	if (!areMapsValid(data.maps)) {
		console.log(`${ws.id} ${validationProp} invalid maps: ${JSON.stringify(data)}`);
		return;
	}
	if (ws[validationProp]) {
		console.log(`${ws.id} tried to change ${listProp} multiple times`);
		return;
	}
	ws[listProp] = ws[listProp].length ? ws[listProp] : data.maps;
	ws[validationProp] = true;
	updateParticipants(webSocketServer, ws.lobbyId);
};

const showResult = (webSocketServer, state, ws) => {
	if (ws.id !== state.adminId) {
		console.log(`${ws.id} tried to show result as non-admin`);
		return;
	}
	updateParticipants(webSocketServer, ws.lobbyId);
	publishResult(webSocketServer, ws.lobbyId);
}

const resetSingleConnection = ws => {
	ws.votes = [];
	ws.voted = false;
	ws.vetos = [];
	ws.vetoed = false;
	sendJson(ws, ['reset']);
};

const reset = (webSocketServer, state, ws) => {
	if (ws.id !== state.adminId) {
		console.log(`${ws.id} tried to reset as non-admin`);
		return;
	}
	getConnectionsByLobbyId(webSocketServer, state.lobbyId).forEach(resetSingleConnection);
	updateParticipants(webSocketServer, ws.lobbyId);
}

const slider = (webSocketServer, state, ws, data) => {
	if (ws.id !== state.adminId) {
		console.log(`${ws.id} tried to change slider settings as non-admin`);
		return;
	}
	const votesPerParticipant = data.items[0].votesPerParticipant;
	const vetosPerParticipant = data.items[0].vetosPerParticipant

	if (sliderIsNotValid(votesPerParticipant) || sliderIsNotValid(vetosPerParticipant)) {
		console.log(`${ws.id} tried to set slider to an invalid value: ${JSON.stringify(data)}`);
		return;
	}

	state.votesPerParticipant = votesPerParticipant;
	state.vetosPerParticipant = vetosPerParticipant;

	updateSettingsForAll(webSocketServer, state);
	reset(webSocketServer, state, ws);
}

const getSettings = state => ({ votesPerParticipant: state.votesPerParticipant, vetosPerParticipant: state.vetosPerParticipant });

const updateSettings = (ws, state) => sendJson(ws, ['settings', getSettings(state)]);

const updateSettingsForAll = (webSocketServer, state) => getConnectionsByLobbyId(webSocketServer, state.lobbyId)
	.forEach(ws => sendJson(ws, ['settings', getSettings(state)]));

const sliderIsNotValid = (value) => {
	return (value < 0 || value > countMaps || !Number.isInteger(value));
}

const process = (webSocketServer, state, ws, msg) => {
	try {
		const [msgType, data] = JSON.parse(msg);

		switch (msgType) {
			case 'show_result':
				showResult(webSocketServer, state, ws);
				break;
			case 'voted':
				handleMapChange(webSocketServer, state, ws, 'voted', 'votes', 'votesPerParticipant', data);
				break;
			case 'vetoed':
				handleMapChange(webSocketServer, state, ws, 'vetoed', 'vetos', 'vetosPerParticipant', data);
				break;
			case 'reset':
				reset(webSocketServer, state, ws)
				break;
			case 'slider':
				slider(webSocketServer, state, ws, data)
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
	sendJson,
	updateSettings
}
