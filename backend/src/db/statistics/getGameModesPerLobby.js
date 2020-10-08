const selectData = require('../selectData');

const gameModeUsageQuery = `
SELECT
	COUNT(*) as size,
	json_array(gameModes) as sets
FROM (
	SELECT
		lgm.lobby_id as lobbyId,
		group_concat(lgm.game_mode) as gameModes
	FROM
		lobby_game_mode lgm
	INNER JOIN
		lobby l
			ON
				l.id = lgm.lobby_id
	GROUP BY
		lgm.lobby_id
	ORDER BY
		l.creation_date DESC
	LIMIT 1000
)
GROUP BY gameModes
;`;

module.exports = async db => {
	const data = await selectData(db, gameModeUsageQuery)

	return data.map(x => ({
		...x, sets: JSON.parse(x.sets)
	}))
};
