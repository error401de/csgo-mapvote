function promisify(fn) {
	return new Promise((resolve, reject) => {
		fn(function (err) {
			if (err) {
				console.error(err);
				return reject(err);
			}
			resolve();
		});
	});
}

module.exports = promisify;
