// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './store';
import { sync } from 'vuex-router-sync';
import VueRouter from 'vue-router';
import App from './components/App';
import TodoLists from './components/TodoLists';
import TodoPage from './components/TodoPage';
import Login from './components/Login';

Vue.config.productionTip = false;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { name: 'lists', path: '/lists', component: TodoLists },
    { name: 'todo', path: '/list/:id', component: TodoPage, props: true },
    { name: 'login', path: '/', component: Login },
  ],
});

sync(store, router);

/* eslint-disable no-new */
// new Vue({ router }).$mount('#app');

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App), //
  // template: '<App/>',
  // components: { App },
});
