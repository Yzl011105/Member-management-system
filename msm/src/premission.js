import router from './router/index.js'
import { getUserInfo } from './api/login.js'

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('stu-token');
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
            getUserInfo(token).then(response => {
                const resp = response.data;
                if (resp.flag) {//为真 代表token去数据库里查，查到了没有问题.
                    localStorage.setItem('stu-user', JSON.stringify(resp.data))//在localStorage中存的时候，需要将对象装换为字符串
                    //存人物信息，确保人物信息是最新的
                    next();
                } else {//没查到信息，说明token有问题,就转到登录界面
                    next({ path :'/login' })
                }
            })
        }
    }
})