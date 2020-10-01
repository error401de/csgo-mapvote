const path = require('path');

const isWsRequest = (pathname, req) => req.protocol === 'ws';

console.log(__dirname, path.resolve(__dirname, '../common'))

module.exports = {
	devServer: {
		proxy: {
			'^/lobby': {
				target: 'ws://localhost:3000',
				filter: isWsRequest,
				ws: true,
				changeOrigin: true
			},
			'^/api': {
				target: 'http://localhost:3000'
			}
		}
	},
	configureWebpack: {
		resolve: {
			alias: {
				common: path.resolve(__dirname, '../common')
			}
		},
	}
};
