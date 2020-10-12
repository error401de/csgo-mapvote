function promisify(fn) {
	return new Promise((resolve, reject) => {
		fn(function (err, result) {
			if (err) {
				console.error(err);
				return reject(err);
			}
			resolve(result);
		});
	});
}

module.exports = promisify;
