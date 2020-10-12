const initialVotedMaps = [];
const initialVetoedMaps = [];

const initialState = {
	maps: [],
	votesLeft: 1,
	vetosLeft: 1,
	votedMaps: initialVotedMaps,
	vetoedMaps: initialVetoedMaps,
	result: null
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
		state.result = null;
	},
	setMapsAction(state, maps) {
		state.maps = maps;
	},
	setVotesLeftAction(state, votesLeft) {
		state.votesLeft = votesLeft;
	},
	setVetosLeftAction(state, vetosLeft) {
		state.vetosLeft = vetosLeft;
	},
	setResultAction(state, newResult) {
		state.result = newResult;
	}
};

export default {
	name: '$choicesStore',
	initialState,
	actions
};
