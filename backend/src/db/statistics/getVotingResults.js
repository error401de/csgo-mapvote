const selectData = require('../selectData');

const votingResultQuery = `
SELECT
	vo.map_id AS id,
	vo.game_mode AS gameMode,
	COUNT(DISTINCT vo.lobby_id) AS timesPlayed
FROM
	vote vo
LEFT JOIN
	veto ve
ON
	ve.lobby_id = vo.lobby_id
AND
	ve.map_id = vo.map_id
AND
	ve.game_mode = vo.game_mode
WHERE
	ve.lobby_id IS NULL
GROUP BY
	vo.map_id,
	vo.game_mode
;`

module.exports = db => selectData.all(db, votingResultQuery);
