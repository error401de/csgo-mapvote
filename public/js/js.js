votingStatus = "voting";

async function createMapBoxes(ws) {
	const url = 'config/maps_competitive.json';
	const response = await fetch(url);
	const json = await response.json();

	json.items.forEach(renderBox.bind(null, ws));
}

function renderBox(ws, { id, name }) {
	const div = document.createElement('div');
	div.setAttribute('class', 'map');
	div.setAttribute('id', id);
	div.textContent = name;
	document.getElementById('box-maps').appendChild(div);
	div.onclick = function () {
		if (votingStatus == 'voting') {
			const tick = document.createElement('div');
			tick.setAttribute('class', 'map-voted map-icon');
			document.getElementById(id).appendChild(tick);
			ws.send(JSON.stringify(["voted", { maps: [id] }]))
			votingStatus = 'vetoing';
		}
		
	}
	
}

function renderUser({ name, vetoed }) {
	const div = document.createElement('div');
	div.setAttribute('class', 'user');
	div.setAttribute('id', 'user' + name);
	div.textContent = "User " + name;
	document.getElementById('box-participants').appendChild(div);

	const status = document.createElement('div');
	
	if (vetoed) {
		status.setAttribute('class', 'participant-finished');
	}
	else {
		status.setAttribute('class', 'participant-waiting');
	}

	document.getElementById('user'+ name).appendChild(status);
}

function handleParticipants(data) {
	const clearList = document.getElementById('box-participants');
	clearList.textContent = '';
	data.items.forEach(renderUser);
}

function handleResult() {
	console.log("hiiiiii");
}

function handleReset() {
	console.log("hiiiiii");
}

function handleRegistered(data) {
	if (data.isAdmin) {
		document.querySelector('#menu-box').style.visibility = 'visible';
	};
}

function sendDataOnClick(elementId, ws, data) {
	document.querySelector(elementId).onclick = () => ws.send(JSON.stringify(data));
}

window.onload = function () {
	const ws = new WebSocket('ws://' + document.location.host);
	createMapBoxes(ws);

	ws.onmessage = function (message) {
		const json = JSON.parse(message.data);

		switch (json[0]) {
			case 'participants':
				handleParticipants(json[1]);
				break;
			case 'result':
				handleResult();
				break;
			case 'reset':
				handleReset();
				break;
			case 'registered':
				handleRegistered(json[1]);
				break;
			default:
				console.log('Message not handled', message);
		}
	}

	sendDataOnClick('#show-result', ws, ['show_result']);
	sendDataOnClick('#reset', ws, ['reset']);
}
