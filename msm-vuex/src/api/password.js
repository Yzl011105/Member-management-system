import request from '@/utils/request.js'

export default {
    //?校验输入的原始密码是否正确
    checkPwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'post',
            data: {
                userId,
                password
            }
        })
    },
    //?修改密码
    updatePwd(userId, password) {
        return request({
            url: '/user/pwd',
            method: 'put',
            data: {
                userId,
                password
            }
        })
    }
}