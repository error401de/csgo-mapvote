import Vue from 'vue';

export default ({ name, initialState, actions }) => {
	if (initialState.debug) {
		throw new Error(`State must not have debug property: ${JSON.stringify(initialState)} in ${name}`);
	}

	const state = Vue.observable(initialState);
	state.debug = document.location.host.includes('localhost');

	const observableActions = {};
	Object.entries(actions).forEach(([key, value]) => {
		observableActions[key] = function (...args) {
			if (state.debug) console.log(`${key} triggered with`, ...args);
			value(state, ...args);
		};
	});

	Vue.prototype[name] = {
		state,
		actions: observableActions
	};
};
