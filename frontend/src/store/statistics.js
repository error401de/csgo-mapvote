const initialState = {
	gameModes: null
};

const actions = {
	setGameModes(state, newValue) {
		state.gameModes = newValue;
	},
};

export default {
	name: '$statisticsStore',
	initialState,
	actions
};
