const promisify = require("../lib/promisify");

module.exports = {
	all: (db, query) => promisify(cb => db.all(query, cb)),
	one: (db, query) => promisify(cb => db.get(query, cb)),
}
