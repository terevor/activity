// import Promise from 'bluebird'
import axios from 'axios'
// import store from '@/store'
// import {
//     USER_SIGNOUT
// } from '@/store/modules/user'
// import router from '@/router'

const instance = axios.create({
    baseURL: process.env.API_HOST,
    timeout: 10000
})

// instance.interceptors.request.use(
//     config => {
//         config.headers['Authorization'] = 'Bearer ' + store.state.user.token
//         return config
//     },
//     error => Promise.reject(error))

instance.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            switch (error.response.status) {
                // case 401:
                //     // 401 清除token信息并跳转到登录页面
                //     store.dispatch(USER_SIGNOUT)
                //     router.replace({
                //         path: '/login',
                //         query: {
                //             from: router.currentRoute.fullPath
                //         }
                //     })
                //     throw new Error('会话已过期，请重新登录')
                case 500:
                case 502:
                case 503:
                    throw new Error('网络繁忙，请稍后再试！')
                case 504:
                    throw new Error('访问超时，请稍后再试！')
            }
        }
        return Promise.reject(error)
    })

/**
 * function httpClient(config) // axios实例封装
 * config: {
 *  method: 'get', // 默认get
 *  url: string,
 *  data: object,  // post、put
 *  params: object // get、delete
 * }
 * return Promise
 **/
export const httpClient = function({
    method = 'get',
    url,
    data,
    params
}) {
    return new Promise(function(resolve, reject) {
        instance({
            method,
            url,
            data,
            params
        }).then(res => {
            resolve(res)
        }, err => {
            reject(err)
        }).catch(err => {
            reject(err)
        })
    })
}

export default {
    install(vue) {
        if (!vue.$http) {
            vue.$http = httpClient
        }

        vue.mixin({
            created: function() {
                this.$http = vue.$http
            }
        })
    }
}
