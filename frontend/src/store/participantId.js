const initialState = {
	participantId: null
};

const actions = {
	setParticipantIdAction(state, newValue) {
		state.participantId = newValue;
	},
};

export default {
	name: '$participantIdStore',
	initialState,
	actions
};
