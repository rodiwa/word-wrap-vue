import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { store } from './store'
import { routes } from './routes'

Vue.use(VueRouter)

Vue.config.productionTip = false

let router = new VueRouter({
  mode: 'history',
  routes: routes
})

new Vue({
  router: router,
  store: store,
  render: h => h(App),
}).$mount('#app')
