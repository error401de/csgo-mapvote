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

function renderUser({name}) {
	const div = document.createElement('div');
	div.setAttribute('class', 'user');
	div.setAttribute('id', 'user'+ name);
	div.textContent = "User " + name;
	document.getElementById('box-participants').appendChild(div);
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

window.onload=function(){
	createMapBoxes();
	const ws = new WebSocket('ws://' + document.location.host);

	ws.onmessage=function(message){
		const json = JSON.parse(message.data);
	ws.send(JSON.stringify(["vetoed", {maps: ['de_dust2']}])) // only for dev reasons

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
		default:
			console.log('Message not handled');
		}
	}
}