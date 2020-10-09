

module.exports = async ({ db, getVotingResults, getChoices }, req, res) => {
	const choices = await getChoices(db);
	const votingResults = await getVotingResults(db);

	return res.json({
		items: choices.map((choice) => ({
			...choice,
			timesPlayed: (votingResults.find(vote => vote.id === choice.id && vote.gameMode === choice.gameMode) || { timesPlayed: 0 }).timesPlayed
		}))
	});
};
