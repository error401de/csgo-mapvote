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

window.onload=function(){
	createMapBoxes();
}