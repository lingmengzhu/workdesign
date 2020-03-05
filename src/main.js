import Vue from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import './assets/iconfont/iconfont.css'
import {
  codemirror
} from 'vue-codemirror'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(Element)
import 'codemirror/lib/codemirror.css'

Vue.use(codemirror)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')