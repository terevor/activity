import Vue from 'vue'
import Router from 'vue-router'
// import store from '@/store'
import NProgress from 'nprogress'

const _import = require(`./_import_${process.env.NODE_ENV}`).default

Vue.use(Router)

/**
 * meta: {
 *   auth: false,    // authentication required or not, default true
 *   permission: ''
 * }
 **/
export const routes = [{
    path: '/',
    redirect: '/home'
}, {
    path: '/home',
    name: 'home',
    component: _import('home'),
    meta: {
        auth: false
    }
}, {
    path: '*',
    redirect: '/'
}]

const router = new Router({
    mode: 'history',
    // scrollBehavior: () => ({
    //     y: 0
    // }),
    routes: routes
})

// const canAccess = (permission) => {
//     if (permission === '') return true
//     const menus = store.state.user.permissions
//     return menus.some(n => {
//         if (n.code === permission) return true
//         if (n.children) {
//             return n.children.some(m => {
//                 return m.code === permission
//             })
//         }
//         return false
//     })
// }

router.beforeEach((to, from, next) => {
    NProgress.start()
    // const {
    //     auth = true, permission = ''
    // } = to.meta
    // if (auth) { // 需要鉴权
    //     const isLogin = Boolean(store.state.user.token)
    //     if (!isLogin) {
    //         NProgress.done()
    //         return next({
    //             path: '/login',
    //             query: {
    //                 from: to.fullPath
    //             }
    //         })
    //     } else if (!canAccess(permission)) {
    //         NProgress.done()
    //         return next({
    //             path: '/401'
    //         })
    //     }
    // }
    // to.meta.from = from.fullPath
    next()
})

router.afterEach(() => {
    NProgress.done()
})

export default router
