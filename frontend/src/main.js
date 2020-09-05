import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';

import App from './App.vue';
import router from './router';
import './assets/css/main.css';

Vue.config.productionTip = false;

Vue.use(VueNativeSock, 'ws://localhost:9090', {
	connectManually: true,
	format: 'json',
	reconnection: true,
	reconnectionAttempts: 5,
	reconnectionDelay: 10000,
});

new Vue({
	router,
	render: function (h) { return h(App) }
}).$mount('#app')
