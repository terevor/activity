// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import App from './App'
import home from './views/home'
// import router from './router'
// import store from './store'
// import * as filters from './filters'
// import { toast } from './plugins'
// import { xx } from './directives'
// import components from './components'

// import 'normalize.css/normalize.css'
// import 'flex.css'
// import 'nprogress/nprogress.css'
// import './assets/iconfont/iconfont.css'
import './assets/styles/index.scss'

// const FastClick = require('fastclick')
// FastClick.attach(document.body)

Vue.config.productionTip = false // 关闭生产模式下应用启动时给出的提示

// Vue.use(toast)

// Vue.directive('xx', xx)

// Object.keys(components).forEach((key) => { // 注册公共组件，组件名首字母大写后以v开头，使用时<v-xxx></v-xxx>
//     const name = key.replace(/(\w)/, (v) => v.toUpperCase())
//     Vue.component(`v${name}`, components[key])
// })

// Object.keys(filters).forEach(k => Vue.filter(k, filters[k]))

if (process.env.NODE_ENV === 'production') {
    Vue.config.errorHandler = function(err, vm) {
        console.log(err, window.location.href)
    }
}

/* eslint-disable no-new */
new Vue({
    el: '#app',
    // router,
    // store,
    render: h => h(home)
})
