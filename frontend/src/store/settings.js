const initialState = {
	settings: null
};

const allGameModes = ['competitive', 'scrimmage'];

const actions = {
	initSettingsAction(state) {
		state.settings = {
			votesPerParticipant: 1,
			vetosPerParticipant: 1,
			gameModes: [allGameModes[0]]
		};
	},
	setSettingsAction(state, newValue) {
		state.settings = newValue;
	},
};

export default {
	name: '$settingsStore',
	initialState,
	actions
};
