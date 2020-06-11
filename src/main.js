import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
Vue.config.productionTip = false
import '@/styles/index.scss'
import './use'
import toastRegistry from './toast/index'
Vue.use(toastRegistry)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
