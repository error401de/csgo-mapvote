const sqlite3 = require('sqlite3').verbose();

const promisify = require('../lib/promisify');

module.exports = (shouldNotCreateTables, fileName, gameModes) => {
	return new Promise((resolve) => {
		if (shouldNotCreateTables) {
			const db = new sqlite3.Database(fileName, sqlite3.OPEN_READWRITE);
			db.get('PRAGMA foreign_keys = ON');
			return resolve(db);
		}

		const db = new sqlite3.Database(fileName);
		db.get('PRAGMA foreign_keys = ON');
		db.serialize(function () {
			const stmnts = [
				`CREATE TABLE
					lobby (
						id VARCHAR(36) NOT NULL,
						votes_per_participant TINYINT NOT NULL,
						vetos_per_participant TINYINT NOT NULL,
						creation_date TIMESTAMP NOT NULL DEFAULT strftime('%s', CURRENT_TIMESTAMP),
						PRIMARY KEY (id)
					);
				`,
				`CREATE TABLE
					game_mode (
						mode VARCHAR(15) PRIMARY KEY NOT NULL
					);
				`,
				`CREATE TABLE
					lobby_game_mode (
						lobby_Id VARCHAR(36) NOT NULL,
						game_mode VARCHAR(15) NOT NULL,
						PRIMARY KEY (lobby_id, game_mode),
						FOREIGN KEY (lobby_id)
							REFERENCES lobby (id),
						FOREIGN KEY (game_mode)
							REFERENCES game_mode (mode)
					);
				`,
				`CREATE TABLE
					vote (
						participant_id VARCHAR(36) NOT NULL,
						lobby_id VARCHAR(36) NOT NULL,
						game_mode VARCHAR(15) NOT NULL,
						map_id VARCHAR(30) NOT NULL,
						PRIMARY KEY (participant_id, lobby_id, game_mode, map_id),
						FOREIGN KEY (lobby_id)
							REFERENCES lobby (id),
						FOREIGN KEY (game_mode)
							REFERENCES game_mode (mode)
					)
				`,
				`CREATE INDEX
					idx_vote_game_mode
				ON
					vote
					(game_mode)
				`,
				`CREATE INDEX
					idx_vote_map_id
				ON
					vote
					(map_id)
				`,
				`CREATE TABLE
					veto (
						participant_id VARCHAR(36) NOT NULL,
						lobby_id VARCHAR(36) NOT NULL,
						game_mode VARCHAR(15) NOT NULL,
						map_id VARCHAR(30) NOT NULL,
						PRIMARY KEY (participant_id, lobby_id, game_mode, map_id),
						FOREIGN KEY (lobby_id)
							REFERENCES lobby (id),
						FOREIGN KEY (game_mode)
							REFERENCES game_mode (mode)
					)
				`,
				`CREATE INDEX
					idx_veto_game_mode
				ON
					veto
					(game_mode)
				`,
				`CREATE INDEX
					idx_veto_map_id
				ON
					veto
					(map_id)
				`,
			];
			stmnts.forEach(stmnt => db.run(stmnt));
			const insertGameModeStmnt = db.prepare('INSERT INTO game_mode (mode) VALUES (?)');
			Promise.all(
				gameModes.map(gameMode => promisify(cb => insertGameModeStmnt.run(gameMode, cb)))
			)
				.then(() => {
					insertGameModeStmnt.finalize();
					resolve(db);
				});
		});
	});
};
