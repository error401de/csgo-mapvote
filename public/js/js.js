(() => {
	let votesLeft = null;
	let vetosLeft = null;
	let settings = {
		votesPerParticipant: 1,
		vetosPerParticipant: 1
	};
	let votedMaps = [];
	let vetoedMaps = [];
	let participantId = null;
	let ws;
	let blockUpdate = 0;

	function createElement(tagName, className, id) {
		const element = document.createElement(tagName);
		className && element.setAttribute('class', className);
		id && element.setAttribute('id', id);

		return element;
	}

	async function createMapBoxes() {
		const url = 'config/maps_competitive.json';
		const response = await fetch(url);
		const json = await response.json();

		json.items.forEach(renderMap);
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

	function renderMap({ id, name }) {
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

	function changeParticipantName(newNameElement) {
		blockUpdate = 0;
		newNameElement.textContent = newNameElement.textContent.trim().substring(0, 30);
		ws.send(JSON.stringify(['participant_name_changed', { name: newNameElement.textContent }]));
	}

	function renderParticipant({ id, name, vetoed }) {
		const div = createElement('div', 'participant', 'participant' + name);
		const span = createElement('span');
		span.textContent = name;
		div.appendChild(span);

		if (id === participantId) {
			const identifier = ' (You)';
			span.textContent = span.textContent + identifier;
			div.classList.add('self');
			span.setAttribute('contenteditable', 'true');
			span.onfocus = () => {
				blockUpdate = 1;
				span.textContent = span.textContent.slice(0, -identifier.length);
			};
			span.onkeyup = (event) => {
				if (event.key === 'Enter' || event.target.textContent.length >= 30) {
					event.preventDefault();
					event.target.blur();
				}
			}
			span.onblur = () => changeParticipantName(span);
		}

		document.getElementById('box-participants').appendChild(div);

		const status = createElement('div', vetoed ? 'participant-finished' : 'participant-waiting');

		div.appendChild(status);
	}

	function handleParticipants(data) {
		if (blockUpdate === 0) {
			const clearList = document.getElementById('box-participants');
			clearList.textContent = '';
			data.items.forEach(renderParticipant);
		}
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
		});
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
		});
		updateLobbySettings();
	}

	function handleRegistered(data) {
		participantId = data.id;
		document.querySelector('.modal-background').style.display = 'block';
		document.querySelector('.modal-background').onclick = closeModal.bind(null, data.lobbyId, 0);

		if (data.isAdmin) {
			document.querySelector('.admin-modal').style.display = 'flex';
			document.querySelector('#box-menu').style.visibility = 'visible';
			const linkToLobby = createElement('div', 'lobby-link');
			linkToLobby.innerHTML = `Lobby Id: ${data.lobbyId}`;
			document.querySelector('#lobby-link-wrapper').insertBefore(linkToLobby, document.querySelector('#lobby-link-wrapper').childNodes[0]);
			document.querySelector('#lobby-link-img').onclick = copyToClipboard.bind(null, data.lobbyId);
			document.querySelector('#lobby-url').innerHTML = generateLobbyUrl(data.lobbyId);
			document.querySelector('#lobby-url').onclick = closeModal.bind(null, data.lobbyId, 1);
		} else {
			document.querySelector('.default-modal').style.display = 'flex';
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

	function sendDataOnClick(elementId, data) {
		document.querySelector(elementId).onclick = () => ws.send(JSON.stringify(data));
	}

	function handleSlider() {
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
		return `${window.location.protocol}//${window.location.host}/lobby/${lobbyId}`;
	}

	function copyToClipboard(lobbyId) {
		const url = generateLobbyUrl(lobbyId);
		const el = document.createElement('textarea');
		el.value = url;
		el.setAttribute('readonly', '');
		el.style = { position: 'absolute', left: '-9999px' };
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

	function navigateToHome() {
		window.location = '/';
	}

	window.onload = function () {
		ws = new WebSocket(`${document.location.protocol === 'https:' ? 'wss' : 'ws'}://${document.location.host}${document.location.pathname}`);
		createMapBoxes();

		ws.onmessage = handleMessage;

		ws.onclose = (closeEvent) => {
			let message = '';
			let shouldNavigateToHome = true;

			switch (closeEvent.code) {
				case 4001:
					message = 'A new lobby can currently not be opened. Please try again later.';
					break;
				case 4400:
					message = 'There are no free seats left, you can not join anymore.';
					break;
				case 4404:
					message = 'Your lobby id is invalid.';
					break;
				case 4504:
					message = 'The Lobby Admin left.';
					break;
				case 4429:
					message = 'You sent too many messages. Try reloading the page in a few seconds.';
					shouldNavigateToHome = false;
					break;
				default:
					message = 'Try reloading the page';
					shouldNavigateToHome = false;
					break;
			}

			alert('Your connection was interrupted: ' + message);
			if (shouldNavigateToHome) {
				navigateToHome();
			}
		};

		window.addEventListener('beforeunload', () =>
			ws.onclose = null
		);

		sendDataOnClick('#show-result', ['show_result']);
		sendDataOnClick('#reset', ['reset']);
		handleSlider();
	}
})();
