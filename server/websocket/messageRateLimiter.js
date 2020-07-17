const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
	points: 10,
	duration: 1,
	blockDuration: 10,
	keyPrefix: 'ws-limiter'
});

const rateLimiterMiddleware = (ws, cb) => {
	rateLimiter.consume(ws.id)
		.then(() => {
			cb();
		})
		.catch(rejectReason => {
			if (rejectReason.isFirstInDuration) {
				console.log(`Closing ${ws.id}, too many messages.`);
			}
			ws.close(4429, 'Too many messages');
		});
};

module.exports = rateLimiterMiddleware;
