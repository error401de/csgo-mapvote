const selectData = require('../selectData');

const groupBySql = `
GROUP BY
	game_mode,
	map_id
`;
const choicesQuery = `
SELECT
	map_id AS id,
	game_mode AS gameMode,
	SUM(votes) AS votes,
	SUM(vetos) AS vetos
FROM (
	SELECT
		map_id,
		game_mode,
		COUNT(*) AS votes,
		0 AS vetos
	FROM
		vote
	${groupBySql}
	UNION ALL
	SELECT
		map_id,
		game_mode,
		0 AS votes,
		COUNT(*) as vetos
	FROM
		veto
	${groupBySql}
)
${groupBySql}
ORDER BY
	map_id ASC, game_mode ASC
;`

module.exports = db => selectData.all(db, choicesQuery);
