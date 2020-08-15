const express = require('express');
const mime = require('mime-types');
const path = require('path');

const config = require('./config');
const handleWebsockets = require('./websocket/handleWebsockets');
const rateLimiterMiddleware = require('./middleware/rateLimiterMiddleware');

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

const webSocketHandler = handleWebsockets(wss);

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

app.listen(config.port, () => console.log(`server is running at http://localhost:${config.port}`));
