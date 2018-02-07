// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import axios from 'axios'
import goods from './components/goods/goods'
import ratings from './components/ratings/ratings'
import seller from './components/seller/seller'

Vue.config.productionTip = false

Vue.use(VueRouter)

// 将axios放在vue的原型中 供其他组件使用
Vue.prototype.axios = axios

// 配置路由
const routes = [
    { path: '/goods', component: goods },
    { path: '/ratings', component: ratings },
    { path: '/seller', component: seller },
    { path: '*', redirect: '/goods' }
]

// 生成路由实例
const router = new VueRouter({
    routes,
    model: 'history'
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
})
