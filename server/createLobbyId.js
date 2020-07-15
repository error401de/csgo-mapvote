const crypto = require('crypto');

module.exports = () => {
	const buf = crypto.randomBytes(3);
	return buf.toString('hex').toUpperCase();
};
