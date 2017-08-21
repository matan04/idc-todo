import Vue from 'vue';
import store from './store';
import {sync} from 'vuex-router-sync';
import VueRouter from 'vue-router';
import App from './App';
import TodoLists from './components/TodoLists';
import TodoPage from './components/TodoPage';
import Login from './components/Login';

//user router
Vue.use(VueRouter);

//define new router
const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { name: 'lists', path: '/lists', component: TodoLists },
    { name: 'todo', path: '/list/:id', component: TodoPage, props: true },
    { name: 'login', path: '/', component: Login },
  ],
});

//sync routed and store together
sync(store, router);

//init new Vue instance
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App),
});
