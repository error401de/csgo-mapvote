const express = require('express');

const handleWebsockets = require('./server/handleWebsockets');
const app = express();

const wss = require('express-ws')(app);

app.use(express.static('public'));

app.ws('/', handleWebsockets(wss));

app.listen(3000, () => console.log('Listening...'));
