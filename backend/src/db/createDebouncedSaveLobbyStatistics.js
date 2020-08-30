const debounce = require('../lib/debounce');
const saveLobbyStatistics = require('./saveLobbyStatistics');

const TWO_MINUTES_IN_SECONDS = 1000 * 60 * 2;

const shouldSaveStatistics = (lobbyState, participants) => {
	const ips = [];
	participants.forEach(participant => {
		const ip = participant.realIp;
		if (!ips.includes(ip)) {
			ips.push(ip);
		}
	});

	return ips.length > 1;
};

module.exports = (db) => {
	return debounce((...args) => {
		if (shouldSaveStatistics(...args)) {
			saveLobbyStatistics(db, ...args)
				.catch(console.error);
		}
	}, TWO_MINUTES_IN_SECONDS);
};
