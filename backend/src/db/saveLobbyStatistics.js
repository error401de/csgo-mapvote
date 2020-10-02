const { v4: uuidv4 } = require('uuid');

const promisify = require('../lib/promisify');

const beginTransaction = (db) => promisify((cb) => db.run('BEGIN TRANSACTION', cb));
const commitTransaction = (db) => promisify((cb) => db.run('COMMIT', cb));
const rollbackTransaction = (db) => promisify((cb) => db.run('ROLLBACK', cb));

const insertLobby = (db, lobbyState) => {
	const lobbyId = uuidv4();
	const stmnt = db.prepare('INSERT INTO lobby (id, votes_per_participant, vetos_per_participant) VALUES (?, ?, ?)');
	return promisify((cb) => stmnt.run(lobbyId, lobbyState.votesPerParticipant, lobbyState.vetosPerParticipant, cb))
		.then(() => {
			stmnt.finalize();
			return lobbyId;
		});
};

const insertLobbyGameModes = (db, lobbyId, lobbyState) => {
	const stmnt = db.prepare('INSERT INTO lobby_game_mode (lobby_id, game_mode) VALUES (?, ?)');
	return Promise.all(lobbyState.gameModes.map(gameMode => promisify((cb) => stmnt.run(lobbyId, gameMode, cb))))
		.then(() => stmnt.finalize());
};

const insertChoice = (stmnt, lobbyId, participantId, choice) => promisify((cb) => {
	const [gameMode, mapId] = choice.split('/');
	stmnt.run(lobbyId, participantId, gameMode, mapId, cb);
});

const insertChoices = async (db, lobbyId, participants) => {
	const insertVoteStatement = db.prepare('INSERT INTO vote (lobby_id, participant_id, game_mode, map_id) VALUES(?, ?, ?, ?)');
	const insertVetoStatement = db.prepare('INSERT INTO veto (lobby_id, participant_id, game_mode, map_id) VALUES(?, ?, ?, ?)');

	await Promise.all(participants.map(async participant => {
		const participantId = uuidv4();
		await Promise.all(participant.votes.map(choice => insertChoice(insertVoteStatement, lobbyId, participantId, choice)));
		await Promise.all(participant.vetos.map(choice => insertChoice(insertVetoStatement, lobbyId, participantId, choice)));
	}));

	insertVoteStatement.finalize();
	insertVetoStatement.finalize();
};

module.exports = async (db, lobbyState, participants) => {
	try {
		await beginTransaction(db);
		const lobbyId = await insertLobby(db, lobbyState);
		await insertLobbyGameModes(db, lobbyId, lobbyState);
		await insertChoices(db, lobbyId, participants);
		await commitTransaction(db);
	} catch (err) {
		console.error('Error saving lobby statistics', err);
		rollbackTransaction(db);
	}
};
