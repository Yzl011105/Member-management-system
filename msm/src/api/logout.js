import request from '@/utils/request';

//退出登录
export function logout(token) {
    return request({
        method: 'post',
        url: '/user/logout',
        data: {
            token
        }
    })
}