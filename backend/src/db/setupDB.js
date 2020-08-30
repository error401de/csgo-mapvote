require('dotenv').config();

const config = require('../config');
const connectToDB = require('./connectToDB');

const fileName = process.env.DB_FILE_NAME;

connectToDB(false, fileName, config.gameModes)
	.then(() => console.log(`Created SQLite db ${fileName}.`))
	.catch(err => console.error(`Error creating SQLite db ${fileName}.`, err));
