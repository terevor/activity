export const USER_SIGNIN = 'USER_SIGNIN' // 登录成功
export const USER_SIGNOUT = 'USER_SIGNOUT' // 退出登录
export const INIT_PERMISSIONS = 'INIT_PERMISSIONS'

export default {
    state: {
        profile: JSON.parse(localStorage.getItem('zksp-user')) || {},
        permissions: JSON.parse(localStorage.getItem('zksp-permissions')) || []
    },
    mutations: {
        [USER_SIGNIN](state, user) {
            localStorage.setItem('zksp-user', JSON.stringify(user))
            Object.assign(state.profile, user)
        },
        [USER_SIGNOUT](state) {
            localStorage.removeItem('zksp-user')
            localStorage.removeItem('zksp-permissions')
            Object.assign(state, {
                profile: {},
                permissions: []
            })
        },
        [INIT_PERMISSIONS](state, list) {
            state.permissions = list
            localStorage.setItem('zksp-permissions', JSON.stringify(list))
        }
    },
    actions: {
        [USER_SIGNIN]({ commit }, user) {
            commit(USER_SIGNIN, user)
        },
        [USER_SIGNOUT]({ commit }) {
            commit(USER_SIGNOUT)
        },
        [INIT_PERMISSIONS]({ commit }, list) {
            commit(INIT_PERMISSIONS, list)
        }
    }
}
