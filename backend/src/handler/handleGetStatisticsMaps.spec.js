const { expect } = require('chai');

const handleGetStatisticsMaps = require('./handleGetStatisticsMaps');

describe('handleGetStatisticsMaps', () => {
	const getChoicesMock = () => Promise.resolve([
		{ id: 'id-1', gameMode: 'mode-1', votes: 1, vetos: 1 },
		{ id: 'id-1', gameMode: 'mode-2', votes: 2, vetos: 2 },
		{ id: 'id-2', gameMode: 'mode-1', votes: 3, vetos: 3 },
	]);
	const getVotingResultsMock = () => Promise.resolve([
		{ id: 'id-1', gameMode: 'mode-1', timesPlayed: 12 },
		{ id: 'id-2', gameMode: 'mode-1', timesPlayed: 13 },
	]);

	const responseMock = {
		json: (obj) => obj
	};

	it('should merge results from getChoices and getVotingResults', async () => {
		const sentResponse = await handleGetStatisticsMaps({
			getChoices: getChoicesMock,
			getVotingResults: getVotingResultsMock,
			db: null
		}, null, responseMock);

		expect(sentResponse).deep.equal({
			items: [
				{ id: 'id-1', gameMode: 'mode-1', votes: 1, vetos: 1, timesPlayed: 12 },
				{ id: 'id-1', gameMode: 'mode-2', votes: 2, vetos: 2, timesPlayed: 0 },
				{ id: 'id-2', gameMode: 'mode-1', votes: 3, vetos: 3, timesPlayed: 13 },
			]
		})
	});
});
