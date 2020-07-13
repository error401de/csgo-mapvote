const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
	points: 3,
	duration: 5,
	blockDuration: 10
});

const rateLimiterMiddleware = (req, res, next) => {
	if (req.url.includes('/.websocket')) {
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
	} else {
		rateLimiter.get(req.ip)
			.then((rateLimiterResponse) => {
				if (rateLimiterResponse && rateLimiterResponse.remainingPoints < 0) {
					return res.status(429).send('Too Many Requests');
				}
				next();
			})
			.catch(error => {
				console.error(error);
				res.next();
			});
	}
};

module.exports = rateLimiterMiddleware;
