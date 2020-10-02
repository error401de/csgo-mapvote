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

const ERROR_CODES = {
	POOL_CLOSED: 4001,
	LOBBY_LOCKED: 4423,
	LOBBY_ID_NOT_FOUND: 4404,
	TOO_MANY_MESSAGES: 4429,
};

module.exports = {
	CLIENT_MESSAGES, SERVER_MESSAGES, ERROR_CODES
};
