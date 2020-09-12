const initialState = {
	participants: null
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
