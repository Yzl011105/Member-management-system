//* 引入封装的方法
import { getToken } from "../../utils/auth";
import { setToken } from "../../utils/auth";
import { getUser } from "../../utils/auth";
import { setUser } from "../../utils/auth";
import { removeToken } from "../../utils/auth";
//* 引入 API login 中的方法
import { login, getUserInfo } from "@/api/login.js"
import { logout } from '@/api/logout.js'

const user = {
    state: {
        token: getToken(),// getToken() 作为token初始值，解决刷新页面之后token为null
        user: null
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            setToken(token)//配合localStorage使用
        },
        SET_USER(state, user) {
            state.user = user;
            // setUser(user);
        },
    },
    actions: {
        //?登录获取token
        Login({ commit }, form) {//替换登录的login方法 form是登录页面的表单
            return new Promise((resolve, reject) => {
                // 提交表单给后台进行验证是否正确
                // resolve 触发成功处理，reject 触发异常处理
                login(form.username, form.password).then(response => {
                    const resp = response.data
                    if (resp.flag) {//通过调用mutations中的方法修改state
                        commit('SET_TOKEN', resp.data.token)// 方法名称，载荷
                        resolve(resp)//成功返回 resp
                    }
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //?通过token获取用户信息
        GetUserInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getUserInfo(state.token).then(response => {
                    const respUser = response.data
                    commit('SET_USER', respUser.data)
                    resolve(respUser)
                }).catch(err => {
                    reject(err)
                })
            })
        },
        //?退出登录
        Logout({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(response => {
                    //将state置空，state中数据删掉，本地存储中的数据删掉
                    const resp = response.data
                    commit('SET_TOKEN', '')
                    commit('SER_USER', {})
                    removeToken();//将localStorage的内容删掉
                    resolve(resp)
                }).catch(err => {
                    reject(err)
                })
            })
        }
    }
}

export default user