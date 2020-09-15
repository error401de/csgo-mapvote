const initialState = {
	votesLeft: 1,
	vetosLeft: 1,
	votedMaps: [],
	vetoedMaps: [],
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
