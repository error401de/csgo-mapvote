import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import Fragment from 'vue-fragment';
import Clipboard from 'v-clipboard';

import App from './App.vue';
import router from './router';
import './assets/css/main.css';

Vue.config.productionTip = false;

Vue.use(VueNativeSock, `${document.location.protocol === "https:" ? "wss" : "ws"}://localhost:3000`, {
	connectManually: true,
});
Vue.use(Fragment.Plugin);
Vue.use(Clipboard);

new Vue({
	router,
	render: function (h) { return h(App) }
}).$mount('#app')
