const getChoices = require("../db/statistics/getChoices");

module.exports = async ({ db }, req, res) => {
	const choices = await getChoices(db);

	return res.json({ items: choices });
};
