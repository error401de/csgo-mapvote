const express = require('express');
const config = require('./config.json')

const handleWebsockets = require('./base/handleWebsockets');
const app = express();

const wss = require('express-ws')(app);

app.use(express.static('public'));

app.ws(config.webSocketBasePath, handleWebsockets(wss));

app.listen(config.port, () => console.log(`server is running at http://localhost:${config.port}`));
