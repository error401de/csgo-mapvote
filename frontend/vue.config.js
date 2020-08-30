const isWsRequest = (pathname, req) => req.protocol === 'ws';

module.exports = {
	devServer: {
		proxy: {
			'^/lobby': {
				target: 'ws://localhost:3000',
				filter: isWsRequest,
				ws: true,
				changeOrigin: true
			},
			'^/config': {
				target: 'ws://localhost:3000'
			}
		}
	}
};
