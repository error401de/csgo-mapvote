const selectData = require('../selectData');
const generateCombinations = require('../../lib/generateCombinations');

const createQuery = gameModeConditions => `SELECT COUNT(DISTINCT lobby_id) as size FROM (
	SELECT
		lgm.lobby_id as lobby_id
	FROM
		lobby_game_mode lgm
	INNER JOIN
		lobby l
	ON
		l.id = lgm.lobby_id
	GROUP BY
		lgm.lobby_id
	HAVING
		group_concat(lgm.game_mode) LIKE '%${gameModeConditions}%'
	ORDER BY
		l.creation_date DESC
	LIMIT 1000
);`

module.exports = async db => {
	const possibleGameModes = (await selectData.all(db, 'SELECT mode FROM game_mode;')).map(({ mode }) => mode);
	const data = [];

	for (let sets of generateCombinations(possibleGameModes)) {
		const gameModeConditions = sets.join(`%' AND group_concat(game_mode) LIKE '%`);
		const result = await selectData.one(db, createQuery(gameModeConditions));
		data.push({ size: result.size, sets });
	}

	return data;
};
