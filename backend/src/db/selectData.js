const promisify = require("../lib/promisify");

module.exports = (db, query) => promisify(cb => db.all(query, cb));
