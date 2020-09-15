const CLIENT_MESSAGES = {
	PARTICIPANT_NAME_CHANGED: 'participant_name_changed',
	RESET: 'reset',
	RESET_VETOS: 'reset_vetos',
	RESET_VOTES: 'reset_votes',
	SHOW_RESULT: 'show_result',
	SETTINGS: 'settings',
	VETOED: 'vetoed',
	VOTED: 'voted',
};

const SERVER_MESSAGES = {
	LOBBY_ADMIN_CHANGE: 'lobby_admin_change',
	PARTICIPANTS: 'participants',
	REGISTERED: 'registered',
	RESULT: 'result',
	RESET: 'reset',
	SETTINGS: 'settings'
};

module.exports = {
	CLIENT_MESSAGES, SERVER_MESSAGES
};
