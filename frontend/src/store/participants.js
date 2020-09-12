const initialState = {
	participants: []
};

const actions = {
	setParticipantsAction(state, newValue) {
		state.participants = newValue;
	},
};

export default {
	name: '$participantsStore',
	initialState,
	actions
};
