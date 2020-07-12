const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
	points: 30,
	duration: 1,
	blockDuration: 10
});

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter.consume(req.ip)
		.then(() => {
			next();
		})
		.catch(rejectReason => {
			if (rejectReason.isFirstInDuration) {
				console.log(`Blocking ${req.ip}.`);
			}
			res.status(429).send('Too Many Requests');
		});
};

module.exports = rateLimiterMiddleware;
