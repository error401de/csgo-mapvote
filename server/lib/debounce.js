function debounce(callback, wait) {
	let timeout = null;
	return (...args) => {
		const context = this;
		if (!context.timeout) {
			context.timeout = setTimeout(() => context.timeout = null, wait);
			callback.apply(context, args);
		}
	};
}

module.exports = debounce;
