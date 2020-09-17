const initialVotedMaps = [];
const initialVetoedMaps = [];

const initialState = {
	votesLeft: 1,
	vetosLeft: 1,
	votedMaps: initialVotedMaps,
	vetoedMaps: initialVetoedMaps,
};

const filterMapId = (mapIdToFilter, mapIdToTest) => mapIdToFilter !== mapIdToTest

const actions = {
	addVoteAction(state, mapId) {
		state.votedMaps = [...state.votedMaps, mapId];
		state.votesLeft--;
	},
	removeVoteAction(state, mapId) {
		state.votedMaps = state.votedMaps.filter(filterMapId.bind(null, mapId));
		state.votesLeft++;
	},
	addVetoAction(state, mapId) {
		state.vetoedMaps = [...state.vetoedMaps, mapId];
		state.vetosLeft--;
	},
	removeVetoAction(state, mapId) {
		state.vetoedMaps = state.vetoedMaps.filter(filterMapId.bind(null, mapId));
		state.vetosLeft++;
	},
	resetAction(state, votesLeft, vetosLeft) {
		state.votesLeft = votesLeft;
		state.vetosLeft = vetosLeft;
		state.votedMaps = initialVotedMaps;
		state.vetoedMaps = initialVetoedMaps;
	},
	setVotesLeftAction(state, votesLeft) {
		state.votesLeft = votesLeft;
	},
	setVetosLeftAction(state, vetosLeft) {
		state.vetosLeft = vetosLeft;
	},
};

export default {
	name: '$choicesStore',
	initialState,
	actions
};
