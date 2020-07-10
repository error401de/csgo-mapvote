(() => {
	const STATUS_VOTING = 1;
	const STATUS_VETOING = 2;
	const STATUS_WAITING = 3;
	let votingStatus = STATUS_VOTING;

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
		img.src = 'img/vetoed.svg';
		img.alt = 'This map was vetoed';
		img.classList.add('map-icon');

		return img;
	}

	function changeStatusTextTo(newText) {
		document.querySelector('#status-message > h2').innerText = newText;
	}

	function renderMap(ws, { id, name }) {
		const div = createElement('div', 'map', id)
		div.textContent = name;
		div.onclick = () => {
			if (votingStatus === STATUS_VOTING) {
				const tick = createElement('div', 'map-voted map-icon');
				document.getElementById(id).appendChild(tick);
				ws.send(JSON.stringify(['voted', { maps: [id] }]));
				votingStatus = STATUS_VETOING;
				changeStatusTextTo('Status: Please place your veto');
			} else if (votingStatus === STATUS_VETOING) {
				document.getElementById(id).appendChild(renderVetoedImg());
				ws.send(JSON.stringify(['vetoed', { maps: [id] }]));
				votingStatus = STATUS_WAITING;
				changeStatusTextTo('Status: Wait until the result is revealed');
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
		document.querySelectorAll('.map').forEach(map => {
			removeMapIcons(map);
			map.style.visibility = 'visible';
			votingStatus = STATUS_VOTING;
			changeStatusTextTo('Status: Please place your vote');
		})
	}

	function handleRegistered(data) {
		if (data.isAdmin) {
			document.querySelector('#box-menu').style.visibility = 'visible';
		}
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
			default:
				console.log('Message not handled', message);
		}
	}

	function sendDataOnClick(ws, elementId, data) {
		document.querySelector(elementId).onclick = () => ws.send(JSON.stringify(data));
	}

	function handleSlider(ws, sliderId, value) {
		let items = [{votesPerParticipant: 1, vetoesPerParticipant: 1}];
		document.querySelectorAll('.slider').forEach(slider => {
			let currentSlider = document.getElementById(slider.id);
			let output = document.getElementById(currentSlider.id+"-value");

			currentSlider.oninput = function () {
				output.innerHTML = currentSlider.value;
			}

			currentSlider.onchange = function () {
				if (slider.id === 'slider-votes') {
					items[0].votesPerParticipant = parseInt(currentSlider.value);
				} else if (slider.id === 'slider-vetoes') {
					items[0].vetoesPerParticipant = parseInt(currentSlider.value);
				}
				ws.send(JSON.stringify(['slider', { items }]));
			}
		})
	}

	window.onload = function () {
		const ws = new WebSocket(`${document.location.protocol === 'https:' ? 'wss' : 'ws'}://${document.location.host}`);
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
