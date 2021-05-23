import Vue from 'vue'
import App from './App.vue'

import VueSidebarMenu from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

import VuePlyr from 'vue-plyr'
import 'vue-plyr/dist/vue-plyr.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faSquareRootAlt, faBook, faFlask, faMagnet, faDna } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

Vue.use(VueSidebarMenu)

Vue.use(VuePlyr, {plyr: {}})

library.add(faUser)
library.add(faSquareRootAlt)
library.add(faBook)
library.add(faFlask)
library.add(faMagnet)
library.add(faDna)
Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
