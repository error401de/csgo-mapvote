(() => {
	let votingStatus = "voting";

	async function createMapBoxes(ws) {
		const url = 'config/maps_competitive.json';
		const response = await fetch(url);
		const json = await response.json();

		json.items.forEach(renderMap.bind(null, ws));
	}

	function renderVetoedImg() {
		const img = document.createElement('img');
		img.src = 'img/vetoed.svg';
		img.alt = 'This map was vetoed';
		img.classList.add('map-icon');

		return img;
	}

	function changeStatusTextTo(newText) {
		document.querySelector('#status-message > h2').innerText = newText;
	}

	function renderMap(ws, { id, name }) {
		const div = document.createElement('div');
		div.setAttribute('class', 'map');
		div.setAttribute('id', id);
		div.textContent = name;
		document.getElementById('box-maps').appendChild(div);
		div.onclick = function () {
			if (votingStatus === 'voting') {
				const tick = document.createElement('div');
				tick.setAttribute('class', 'map-voted map-icon');
				document.getElementById(id).appendChild(tick);
				ws.send(JSON.stringify(["voted", { maps: [id] }]));
				votingStatus = 'vetoing';
				changeStatusTextTo('Status: Please place your veto');
			} else if (votingStatus === 'vetoing') {
				document.getElementById(id).appendChild(renderVetoedImg());
				ws.send(JSON.stringify(["vetoed", { maps: [id] }]));
				votingStatus = 'waiting';
				changeStatusTextTo('Status: Wait until the result is revealed');
			}
		}
	}

	function renderParticipant({ name, vetoed }) {
		const div = document.createElement('div');
		div.setAttribute('class', 'participant');
		div.setAttribute('id', 'participant' + name);
		div.textContent = "Player " + name;
		document.getElementById('box-participants').appendChild(div);

		const status = document.createElement('div');

		if (vetoed) {
			status.setAttribute('class', 'participant-finished');
		}
		else {
			status.setAttribute('class', 'participant-waiting');
		}

		document.getElementById('participant' + name).appendChild(status);
	}

	function handleParticipants(data) {
		const clearList = document.getElementById('box-participants');
		clearList.textContent = '';
		data.items.forEach(renderParticipant);
	}

	function removeMapIcons(map) {
		const nodes = [...map.childNodes]; // copy because for loop mutates map.childNodes
		for (let node of nodes) {
			if (node.className && node.className.includes('map-icon')) {
				node.remove();
			}
		}
	}

	function handleResult(data) {
		document.querySelectorAll('.map').forEach(map => {
			removeMapIcons(map);
			if (!data.items.some(({ votes }) => votes.includes(map.id))) {
				map.style.visibility = 'hidden';
			}
			if (data.items.some(({ vetos }) => vetos.includes(map.id))) {
				map.appendChild(renderVetoedImg());
			}
		})
		changeStatusTextTo('Status: Wait until the votes are reset');
	}

	function handleReset() {
		document.querySelectorAll('.map').forEach(map => {
			removeMapIcons(map);
			map.style.visibility = 'visible';
			votingStatus = 'voting';
			changeStatusTextTo('Status: Please place your vote');
		})
	}

	function handleRegistered(data) {
		if (data.isAdmin) {
			document.querySelector('#box-menu').style.visibility = 'visible';
		}
	}

	function sendDataOnClick(elementId, ws, data) {
		document.querySelector(elementId).onclick = () => ws.send(JSON.stringify(data));
	}

	window.onload = function () {
		const ws = new WebSocket((document.location.protocol === 'https:' ? 'wss://' : 'ws://') + document.location.host);
		createMapBoxes(ws);

		ws.onmessage = function (message) {
			const json = JSON.parse(message.data);

			switch (json[0]) {
				case 'participants':
					handleParticipants(json[1]);
					break;
				case 'result':
					handleResult(json[1]);
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

		ws.onclose = () => alert('Your connection was interrupted.');

		sendDataOnClick('#show-result', ws, ['show_result']);
		sendDataOnClick('#reset', ws, ['reset']);
	}
})();
