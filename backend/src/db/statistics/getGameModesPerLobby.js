const selectData = require('../selectData');

const gameModeUsageQuery = `
SELECT
	lgm.lobby_id as lobbyId,
	json_array(group_concat(lgm.game_mode)) as gameModes
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
LIMIT 1000;
;`;

module.exports = db => selectData(db, gameModeUsageQuery);
