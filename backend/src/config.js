const { GAME_MODES } = require('./lib/constants');

module.exports = {
	port: 3000,
	webSocketBasePath: '/lobby',
	gameModes: [
		GAME_MODES.COMPETITIVE,
		GAME_MODES.SCRIMMAGE
	]
}
