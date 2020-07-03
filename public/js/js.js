async function createMapBoxes() {

	let url = 'config/maps_competitive.json';
	let response = await fetch(url);
	let json = await response.json();

	for (var i = 0; i < json.items.length; i++) {
		renderBox(json.items[i].id, json.items[i].name)
	}
}

function renderBox(id, text) {
	var div = document.createElement('div');
	div.setAttribute('class', 'map');
	div.setAttribute('id', id);
	div.textContent = text;
	document.getElementById('box-maps').appendChild(div);
}

window.onload=function(){
	createMapBoxes();
}