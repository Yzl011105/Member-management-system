import router from './router/index.js'
import { getUserInfo } from './api/login.js'
import store from './store'//导入store

router.beforeEach((to, from, next) => {
    // const token = localStorage.getItem('stu-token');
    const token = store.state.user.token//权限管理的token不在本地获取，需要在Vuex中获取
    if (!token) {//没拿到token，证明没有登录
        if (to.path === '/login' || to.path === '/register') {
            //如果当前路径在登录或者注册界面，只需要调用next方法来结束这个钩子函数
            next();
        } else {
            next({ path: '/login' })//其它路径就跳转到 /login
        }
    } else {
        if (to.path === '/login') {
            next();
        } else if (to.path === '/register') {
            next();
        } else {
            store.dispatch('GetUserInfo').then(response => {
                if (response.flag) {
                    next()
                } else {//获取用户信息失败，跳转登录界面
                    next({ path: '/login' })
                }
            })
        }
    }
})