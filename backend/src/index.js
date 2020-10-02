const express = require('express');
require('dotenv').config();

const config = require('./config');
const connectToDB = require('./db/connectToDB');
const handleWebsockets = require('./websocket/handleWebsockets');
const rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');
const createLobbyId = require('./createLobbyId');

const isProduction = process.env.NODE_ENV === 'production';

connectToDB(isProduction, process.env.DB_FILE_NAME, config.gameModes).then(db => {
	console.log(`Connected to SQLite3 DB ${process.env.DB_FILE_NAME}.`);
	const app = express();

	const state = new Map();

	app.enable('trust proxy');

	app.use('/', rateLimiterMiddleware);

	const wss = require('express-ws')(app, undefined, {
		wsOptions: {
			maxPayload: 5 * 1024
		}
	});

	const parametrizedWebSocketPath = config.webSocketBasePath + '/:lobbyId?';

	const webSocketHandler = handleWebsockets(wss, db, state);

	app.ws(config.webSocketBasePath, webSocketHandler);
	app.ws(parametrizedWebSocketPath, webSocketHandler);

	const router = express.Router();

	router.post(config.webSocketBasePath, (req, res) => {
		const lobbyId = createLobbyId();
		state.set(lobbyId, null);
		res.json({ id: lobbyId });

		setTimeout(() => {
			if (state.get(lobbyId) === null) {
				state.delete(lobbyId);
			}
		}, 30000);
	});

	router.use(express.static('public', { extensions: ['json'] }));

	app.use('/api', router);

	process.on('exit', function () {
		console.log('closing db');
		db.close();
	});
	app.listen(process.env.PORT, () => console.log(`server is running at http://localhost:${process.env.PORT}`));
});
