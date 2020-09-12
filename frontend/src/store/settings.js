const allGameModes = ['competitive', 'scrimmage'];

const initialState = {
	settings: {
		votesPerParticipant: 1,
		vetosPerParticipant: 1,
		gameModes: [allGameModes[0]]
	},
	participantId: null,
	isAdmin: null
};

const actions = {
	setSettingsAction(state, newValue) {
		state.settings = newValue;
	},
	setParticipantIdAction(state, newValue) {
		state.participantId = newValue;
	},
	setIsAdminAction(state, newValue) {
		state.isAdmin = newValue;
	},
};

export default {
	name: '$settingsStore',
	initialState,
	actions
};
