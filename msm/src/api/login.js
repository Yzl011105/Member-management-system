import request from '@/utils/request';

//*登录
export function login(username, password) {//导出非默认成员方法 将这两个参数传给服务端
    return request({
        method: 'post',
        url: '/user/login',
        data: {
            username,
            password
        }
    })
}

//*获取用户信息
export function getUserInfo(token) {
    return request({
        method: 'get',
        url: `/user/info?token=${token}`
    })
}