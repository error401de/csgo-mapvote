const getGameModesPerLobby = require('../db/statistics/getGameModesPerLobby');

module.exports = async ({ db }, req, res) => {
	const gameModesPerLobby = await getGameModesPerLobby(db);

	return res.json({ gameModesPerLobby });
};
