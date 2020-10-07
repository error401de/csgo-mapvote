import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/lobby/:lobbyId?',
		name: 'Lobby',
		component: function () {
			return import(/* webpackChunkName: "lobby" */ '../views/Lobby.vue')
		}
	},
	{
		path: '/statistics',
		name: 'Statistics',
		component: function () {
			return import(/* webpackChunkName: "statistics" */ '../views/Statistics.vue')
		}
	}
];

const router = new VueRouter({
	routes
});

export default router;
