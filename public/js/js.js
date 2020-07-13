(() => {
	let votesLeft = null;
	let vetosLeft = null;
	let settings = {
		votesPerParticipant: 1,
		vetosPerParticipant: 1
	};
	let votedMaps = [];
	let vetoedMaps = [];

	function createElement(tagName, className, id) {
		const element = document.createElement(tagName);
		className && element.setAttribute('class', className);
		id && element.setAttribute('id', id);

		return element;
	}

	async function createMapBoxes(ws) {
		const url = 'config/maps_competitive.json';
		const response = await fetch(url);
		const json = await response.json();

		json.items.forEach(renderMap.bind(null, ws));
	}

	function renderVetoedImg() {
		const img = document.createElement('img');
		img.src = 'img/rejected.svg';
		img.alt = 'This map was vetoed';
		img.classList.add('map-icon');

		return img;
	}

	function changeStatusTextTo(newText) {
		document.querySelector('#status-message > h2').innerText = newText;
	}

	function renderMap(ws, { id, name }) {
		const div = createElement('div', 'map button', id)
		div.textContent = name;
		div.onclick = () => {
			if (votesLeft > 0) {
				const tick = createElement('div', 'map-voted map-icon');
				document.getElementById(id).appendChild(tick);
				votesLeft--;
				changeStatusTextTo('Status: Please place your vote. ' + votesLeft + ' left.');
				votedMaps.push(id);
				if (votesLeft === 0) {
					ws.send(JSON.stringify(['voted', { maps: votedMaps }]));
					changeStatusTextTo('Status: Please place your veto. ' + vetosLeft + ' left.');
				}
			}
			else if (vetosLeft > 0) {
				document.getElementById(id).appendChild(renderVetoedImg());
				vetosLeft--;
				changeStatusTextTo('Status: Please place your veto. ' + vetosLeft + ' left.');
				vetoedMaps.push(id);
				if (vetosLeft === 0) {
					ws.send(JSON.stringify(['vetoed', { maps: vetoedMaps }]));
					changeStatusTextTo('Status: Wait until the result is revealed');
				}
			}
		}
		document.getElementById('box-maps').appendChild(div);
	}

	function renderParticipant({ name, vetoed }) {
		const div = createElement('div', 'participant', 'participant' + name);
		div.textContent = name;
		document.getElementById('box-participants').appendChild(div);

		const status = createElement('div', vetoed ? 'participant-finished' : 'participant-waiting');

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
		votedMaps = [];
		vetoedMaps = [];
		votesLeft = settings.votesPerParticipant;
		vetosLeft = settings.vetosPerParticipant;
		document.querySelectorAll('.map').forEach(map => {
			removeMapIcons(map);
			map.style.visibility = 'visible';
			changeStatusTextTo('Status: Please place your vote. ' + votesLeft + " left.");
		})
		updateLobbySettings();
	}

	function handleRegistered(data) {
		if (data.isAdmin) {
			document.querySelector('#box-menu').style.visibility = 'visible';
			const linkToLobby = createElement('div', 'lobby-link');
			linkToLobby.innerHTML = `Lobby Id: ${data.lobbyId}`;
			document.querySelector('.modal-background').style.display = 'block';
			document.querySelector('#lobby-link-wrapper').insertBefore(linkToLobby, document.querySelector('#lobby-link-wrapper').childNodes[0]);
			document.querySelector('#lobby-link-img').onclick = copyToClipboard.bind(null, data.lobbyId);
			document.querySelector('#lobby-url').innerHTML = generateLobbyUrl(data.lobbyId);
			document.querySelector('#lobby-url').onclick = closeModal.bind(null, data.lobbyId, 1);
			document.querySelector('.modal-background').onclick = closeModal.bind(null, data.lobbyId, 0);
		} else {
			document.querySelector('#box-settings').style.display = 'flex';
		}
	}

	function handleSettings(data) {
		votesLeft = data.votesPerParticipant;
		vetosLeft = data.vetosPerParticipant;
		settings = data;
		changeStatusTextTo('Status: Please place your vote. ' + votesLeft + " left.");
		updateLobbySettings();
	}

	function handleMessage(message) {
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
			case 'settings':
				handleSettings(json[1]);
				break;
			default:
				console.log('Message not handled', message);
		}
	}

	function sendDataOnClick(ws, elementId, data) {
		document.querySelector(elementId).onclick = () => ws.send(JSON.stringify(data));
	}

	function handleSlider(ws, sliderId, value) {
		let items = [{ votesPerParticipant: 1, vetosPerParticipant: 1 }];
		document.querySelectorAll('.slider').forEach(slider => {
			let currentSlider = document.getElementById(slider.id);
			let output = document.getElementById(currentSlider.id + "-value");

			currentSlider.oninput = function () {
				output.innerHTML = currentSlider.value;
			}

			currentSlider.onchange = function () {
				if (slider.id === 'slider-votes') {
					items[0].votesPerParticipant = parseInt(currentSlider.value);
				} else if (slider.id === 'slider-vetos') {
					items[0].vetosPerParticipant = parseInt(currentSlider.value);
				}
				ws.send(JSON.stringify(['slider', { items }]));
			}
		})
	}

	function generateLobbyUrl(lobbyId) {
		let url = window.location.href + "?lobbyId=" + lobbyId;
		return url;
	}

	function copyToClipboard(lobbyId) {
		let url = generateLobbyUrl(lobbyId);
		var el = document.createElement('textarea');
		el.value = url;
		el.setAttribute('readonly', '');
		el.style = {position: 'absolute', left: '-9999px'};
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}

	function closeModal(lobbyId, clipboard) {
		if (clipboard) {
			copyToClipboard(lobbyId);
		}
		document.querySelector('.modal-background').style.display = 'none';
	}

	function updateLobbySettings() {
		document.querySelector('#show-settings-votes').innerHTML = 'Votes: ' + settings.votesPerParticipant;
		document.querySelector('#show-settings-vetos').innerHTML = 'Vetos: ' + settings.vetosPerParticipant;
	}

	window.onload = function () {
		const ws = new WebSocket(`${document.location.protocol === 'https:' ? 'wss' : 'ws'}://${document.location.host}${document.location.search}`);
		createMapBoxes(ws);

		ws.onmessage = handleMessage;

		ws.onclose = () => alert('Your connection was interrupted.');
		window.addEventListener('beforeunload', () =>
			ws.onclose = null
		);

		sendDataOnClick(ws, '#show-result', ['show_result']);
		sendDataOnClick(ws, '#reset', ['reset']);
		handleSlider(ws);
	}
})();
