const initialState = {
	gameModes: null,
	maps: null
};

const actions = {
	setGameModes(state, newValue) {
		state.gameModes = newValue;
	},
	setMaps(state, newValue) {
		state.maps = newValue;
	},
};

export default {
	name: '$statisticsStore',
	initialState,
	actions
};
