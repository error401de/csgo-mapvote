const express = require('express');
const mime = require('mime-types');

const config = require('./config.json');
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

app.use(express.static('public', {
	setHeaders: (res, path) => {
		switch (mime.lookup(path)) {
			case 'image/png':
			case 'image/svg+xml':
				res.setHeader('Cache-Control', 'public, max-age=86400');
				break;
		}
	}
}));

app.ws(config.webSocketBasePath, handleWebsockets(wss));

app.listen(config.port, () => console.log(`server is running at http://localhost:${config.port}`));
