(() => {
	const allGameModes = ['competitive', 'scrimmage'];
	let votesLeft = null;
	let vetosLeft = null;
	let settings = {
		votesPerParticipant: 1,
		vetosPerParticipant: 1,
		gameModes: [allGameModes[0]]
	};
	let votedMaps = [];
	let vetoedMaps = [];
	let participantId = null;
	let ws;
	let blockUpdate = 0;

	function sendMessage(msg) {
		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(msg);
		}
	}

	function createElement(tagName, className, id) {
		const element = document.createElement(tagName);
		className && element.setAttribute('class', className);
		id && element.setAttribute('id', id);

		return element;
	}

	function renderMap({ id, name, gameMode }) {
		const elementId = `${gameMode}/${id}`;
		const div = createElement('div', 'map button', elementId);
		div.textContent = name;
		div.onclick = () => {
			if (votedMaps.includes(elementId)) {
				removeVote(elementId);
			} else if (vetoedMaps.includes(elementId)) {
				removeVeto(elementId);
			} else if (votesLeft > 0) {
				addVote(elementId);
			} else if (vetosLeft > 0) {
				addVeto(elementId);
			}
		}
		setMapVisibilityByGameMode(div);
		document.getElementById('box-maps').appendChild(div);
	}

	async function createMapBoxes() {
		return Promise.all(
			allGameModes.map(async gameMode => {
				const url = `config/maps_${gameMode}.json`;
				const response = await fetch(url);
				const json = await response.json();
				return json.items.map(item => ({ ...item, gameMode }));
			})
		).then(maps => maps.flat().forEach(renderMap));
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

	function sendVotes() {
		sendMessage(JSON.stringify(['voted', { maps: votedMaps }]));
		vetosLeft ? displayVetoingStatus() : changeStatusTextTo('Status: Wait until the result is revealed');
	}

	function sendVetos() {
		sendMessage(JSON.stringify(['vetoed', { maps: vetoedMaps }]));
		changeStatusTextTo('Status: Wait until the result is revealed');
	}

	function displayVotingStatus() {
		changeStatusTextTo('Status: Please place your vote. ' + votesLeft + ' left.');
		document.getElementById('skip').innerText = 'Skip Votes';
	}

	function displayVetoingStatus() {
		changeStatusTextTo('Status: Please place your veto. ' + vetosLeft + ' left.');
		document.getElementById('skip').innerText = 'Skip Vetos';
	}

	function removeVote(id) {
		if (votesLeft === 0) {
			sendMessage(JSON.stringify(['reset_votes']));
		};
		votesLeft++;
		removeMapIcons(document.getElementById(id));
		votedMaps = votedMaps.filter(mapId => mapId !== id);
		displayVotingStatus();
	}

	function removeVeto(id) {
		if (vetosLeft === 0) {
			sendMessage(JSON.stringify(['reset_vetos']));
		}
		vetosLeft++;
		removeMapIcons(document.getElementById(id));
		vetoedMaps = vetoedMaps.filter(mapId => mapId !== id);
		if (!votesLeft) { // else status text should keep displaying amount of votes
			displayVetoingStatus();
		}
	}

	function addVote(id) {
		const tick = createElement('div', 'map-voted map-icon');
		document.getElementById(id).appendChild(tick);
		votesLeft--;
		votedMaps.push(id);
		displayVotingStatus();
		if (votesLeft === 0) {
			sendVotes();
		}
	}

	function addVeto(id) {
		document.getElementById(id).appendChild(renderVetoedImg());
		vetosLeft--;
		displayVetoingStatus();
		vetoedMaps.push(id);
		if (vetosLeft === 0) {
			sendVetos();
		}
	}

	function enableAdminFeatures() {
		document.querySelector('#box-menu').classList.add('admin-view');
		document.querySelector('.slider-wrapper').classList.remove('tooltip');
		document.querySelector('#game-modes').classList.remove('tooltip');
		document.querySelectorAll('input[type="checkbox"]').forEach(node => node.disabled = false);
		document.querySelectorAll('.slider').forEach(node => node.disabled = false);
	}

	function handleAdminChange({ isAdmin }) {
		if (isAdmin) {
			enableAdminFeatures();
		}
	}

	function changeParticipantName(newNameElement) {
		blockUpdate = 0;
		newNameElement.textContent = newNameElement.textContent.trim().substring(0, 30);
		sendMessage(JSON.stringify(['participant_name_changed', { name: newNameElement.textContent }]));
	}

	function renderParticipant({ id, name, vetoed, voted }) {
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
			};
			span.onblur = () => changeParticipantName(span);
		}

		document.getElementById('box-participants').appendChild(div);

		const status = createElement('div', (voted && vetoed) ? 'participant-finished' : 'participant-waiting');

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

	function setMapVisibilityByGameMode(map) {
		map.style.display = settings.gameModes.some(gameMode => map.id.startsWith(gameMode)) ? 'flex' : 'none';
	}

	function handleReset() {
		votedMaps = [];
		vetoedMaps = [];
		votesLeft = settings.votesPerParticipant;
		vetosLeft = settings.vetosPerParticipant;
		document.querySelectorAll('.map').forEach(map => {
			removeMapIcons(map);
			map.style.visibility = 'visible';
			displayVotingStatus();
		});
		updateLobbySettings();
	}

	function handleRegistered(data) {
		participantId = data.id;
		document.querySelector('.modal-background').style.display = 'block';
		document.querySelector('.modal-background').onclick = closeModal.bind(null, data.lobbyId, 0);
		const linkToLobby = createElement('div', 'lobby-link');
		linkToLobby.innerHTML = `Lobby Id: ${data.lobbyId}`;
		document.querySelector('#lobby-link-wrapper').insertBefore(linkToLobby, document.querySelector('#lobby-link-wrapper').childNodes[0]);
		document.querySelector('#lobby-link-img').onclick = copyToClipboard.bind(null, data.lobbyId);

		if (data.isAdmin) {
			enableAdminFeatures();
			document.querySelector('.admin-modal').style.display = 'flex';
			document.querySelector('#lobby-url').innerHTML = generateLobbyUrl(data.lobbyId);
			document.querySelector('#lobby-url').onclick = closeModal.bind(null, data.lobbyId, 1);
		} else {
			document.querySelector('.default-modal').style.display = 'flex';
		}
	}

	function getMapCountByGameMode(maps, gameModes) {
		return Array.from(maps).filter(map => gameModes.some(gameMode => map.id.startsWith(gameMode))).length
	}

	function handleSettings(data) {
		votesLeft = data.votesPerParticipant;
		vetosLeft = data.vetosPerParticipant;
		settings = data;
		displayVotingStatus();
		updateLobbySettings();
		const maps = document.querySelectorAll('.map');
		maps.forEach(setMapVisibilityByGameMode);
		allGameModes.forEach(gameMode => {
			document.getElementById(`game-mode-${gameMode}`).checked = settings.gameModes.includes(gameMode);
		});
		const maxChoices = getMapCountByGameMode(maps, settings.gameModes);;
		document.querySelectorAll('.slider').forEach(slider => {
			slider.max = maxChoices;
		});
	}

	function handleMessage(message) {
		const json = JSON.parse(message.data);

		switch (json[0]) {
			case 'lobby_admin_change':
				handleAdminChange(json[1]);
				break;
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
		document.querySelector(elementId).onclick = () => sendMessage(JSON.stringify(data));
	}

	function handleSlider() {
		let votesPerParticipant = 1;
		let vetosPerParticipant = 1;
		document.querySelectorAll('.slider').forEach(slider => {
			const currentSlider = document.getElementById(slider.id);
			const output = document.getElementById(currentSlider.id + "-value");

			currentSlider.oninput = function () {
				output.innerHTML = currentSlider.value;
			}

			currentSlider.onchange = function () {
				if (slider.id === 'slider-votes') {
					votesPerParticipant = parseInt(currentSlider.value);
				} else if (slider.id === 'slider-vetos') {
					vetosPerParticipant = parseInt(currentSlider.value);
				}
				sendMessage(JSON.stringify(['settings', { ...settings, votesPerParticipant, vetosPerParticipant }]));
			};
		});
	}

	function handleGameModes() {
		allGameModes.forEach(gameMode => {
			const checkbox = document.getElementById(`game-mode-${gameMode}`);
			checkbox.checked = settings.gameModes.includes(gameMode);
			checkbox.onchange = () => {
				const gameModes = allGameModes.filter(gameMode => document.getElementById(`game-mode-${gameMode}`).checked);
				const maps = document.querySelectorAll('.map');
				const maxChoices = getMapCountByGameMode(maps, gameModes);
				document.querySelectorAll('.slider').forEach(slider => {
					slider.max = maxChoices;
					slider.value = Math.min(parseInt(slider.value) || 1, maxChoices);
					slider.dispatchEvent(new Event('input'));
				});
				sendMessage(JSON.stringify(['settings', {
					votesPerParticipant: parseInt(document.getElementById('slider-votes').value),
					vetosPerParticipant: parseInt(document.getElementById('slider-vetos').value),
					gameModes
				}]));
			};
		});
	}

	function handleSkip() {
		document.getElementById('skip').onclick = () => {
			if (votesLeft) {
				votesLeft = 0;
				sendVotes();
				return;
			}
			if (vetosLeft) {
				vetosLeft = 0;
				sendVetos();
			}
		};
	}

	function handleResetSelf() {
		document.getElementById('reset-self').onclick = () => {
			handleReset();
			sendMessage(JSON.stringify(['reset_votes']));
			sendMessage(JSON.stringify(['reset_vetos']));
		}
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
		document.querySelector('#slider-votes').value = settings.votesPerParticipant;
		document.querySelector('#slider-votes-value').innerHTML = settings.votesPerParticipant;
		document.querySelector('#slider-vetos').value = settings.vetosPerParticipant;
		document.querySelector('#slider-vetos-value').innerHTML = settings.vetosPerParticipant;
	}

	function navigateToHome() {
		window.location = '/';
	}

	function handleWSClosed(closeEvent) {
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
			case 4429:
				message = 'You sent too many messages. Try reloading the page in a few seconds.';
				shouldNavigateToHome = false;
				break;
			default:
				message = 'Try reloading the page';
				shouldNavigateToHome = false;
				break;
		}
		document.querySelectorAll('.modal').forEach(node => node.style.display = 'none');
		const errorModal = document.querySelector('.error-modal');
		errorModal.style.display = 'flex';
		const modalBackground = document.querySelector('.modal-background');
		modalBackground.style.display = 'block';
		errorModal.querySelector('#error-message').textContent = message;

		if (shouldNavigateToHome) {
			errorModal.querySelector('a').style.display = 'block';
			modalBackground.onclick = navigateToHome;
		}
	};


	window.onload = async function () {
		const mapBoxesPromise = createMapBoxes();
		sendDataOnClick('#show-result', ['show_result']);
		sendDataOnClick('#reset', ['reset']);
		handleSlider();
		handleGameModes();
		handleSkip();
		handleResetSelf();
		await mapBoxesPromise;

		ws = new WebSocket(`${document.location.protocol === 'https:' ? 'wss' : 'ws'}://${document.location.host}${document.location.pathname}`);

		ws.onmessage = handleMessage;

		ws.onclose = handleWSClosed;

		window.addEventListener('beforeunload', () =>
			ws.onclose = null
		);

	}
})();
