const express = require('express');
const mime = require('mime-types');

const config = require('./config.json');
const handleWebsockets = require('./base/handleWebsockets');

const app = express();

const wss = require('express-ws')(app);

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