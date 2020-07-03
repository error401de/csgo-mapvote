async function createMapBoxes() {
	const url = 'config/maps_competitive.json';
	const response = await fetch(url);
	const json = await response.json();

	json.items.forEach(renderBox);
}

function renderBox({id, name}) {
	const div = document.createElement('div');
	div.setAttribute('class', 'map');
	div.setAttribute('id', id);
	div.textContent = name;
	document.getElementById('box-maps').appendChild(div);
}

function handleParticipants() {
	console.log("hiiiiii");
}

function handleResult() {
	console.log("hiiiiii");
}

function handleReset() {
	console.log("hiiiiii");
}

window.onload=function(){
	createMapBoxes();
	const ws = new WebSocket('ws://' + document.location.host);
	
	ws.onmessage=function(message){
		const json = JSON.parse(message.data);
		console.log(json);
		switch (json[0]) {
			case 'participants':
				handleParticipants();
				break;
			case 'result':
				handleResult();
				break;
			case 'reset':
				handleReset();
				break;
		default:
			console.log('Message not handled');
		}
	}
}