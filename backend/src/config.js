const { GAME_MODES } = require('./lib/constants');

module.exports = Object.freeze({
	webSocketBasePath: '/lobby',
	gameModes: [
		GAME_MODES.COMPETITIVE,
		GAME_MODES.SCRIMMAGE
	]
});
