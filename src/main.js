import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import { store } from './store'
import { routes } from './routes'

import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faPlus,
  faList,
  faRecycle,
  faTrashAlt,
  faFolderPlus,
  faFont,
  faHome,
  faSignInAlt,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(VueRouter)

library.add(faPlus)
library.add(faRecycle)
library.add(faTrashAlt)
library.add(faPlus)
library.add(faList)
library.add(faFolderPlus)
library.add(faFont)
library.add(faHome)
library.add(faSignInAlt)
library.add(faSignOutAlt)
Vue.component('fa-icon', FontAwesomeIcon)

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
