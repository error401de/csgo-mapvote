const express = require('express');
const mime = require('mime-types');
const path = require('path');
require('dotenv').config();

const config = require('./config');
const connectToDB = require('./db/connectToDB');
const handleWebsockets = require('./websocket/handleWebsockets');
const rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');

const isProduction = process.env.NODE_ENV === 'production';

connectToDB(isProduction, process.env.DB_FILE_NAME, config.gameModes).then(db => {
	console.log(`Connected to SQLite3 DB ${process.env.DB_FILE_NAME}.`);
	const app = express();

	app.enable('trust proxy');

	app.use('/', rateLimiterMiddleware);

	const wss = require('express-ws')(app, undefined, {
		wsOptions: {
			maxPayload: 5 * 1024
		}
	});

	const parametrizedWebSocketPath = config.webSocketBasePath + '/:lobbyId?'

	app.get(parametrizedWebSocketPath, (req, res, next) => {
		if (req.wsHandled === false) {
			return next();
		}
		res.sendFile(path.join(__dirname, '../public/lobby.html'))
	});

	const webSocketHandler = handleWebsockets(wss, db);

	app.ws(config.webSocketBasePath, webSocketHandler);
	app.ws(parametrizedWebSocketPath, webSocketHandler);

	app.use(express.static('public', {
		setHeaders: (res, path) => {
			switch (mime.lookup(path)) {
				case 'image/png':
				case 'image/svg+xml':
					res.setHeader('Cache-Control', 'public, max-age=86400');
					break;
			}
		},
		index: ['index.html'],
		extensions: ['html'],
	}));

	process.on('exit', function () {
		console.log('closing db');
		db.close();
	});
	app.listen(config.port, () => console.log(`server is running at http://localhost:${config.port}`));
});
