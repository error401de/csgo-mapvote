import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';

import App from './App.vue';
import router from './router';
import './assets/css/main.css';

Vue.config.productionTip = false;

Vue.use(VueNativeSock, `${document.location.protocol === "https:" ? "wss" : "ws"}://localhost:3000`, {
	connectManually: true,
});

new Vue({
	router,
	render: function (h) { return h(App) }
}).$mount('#app')
