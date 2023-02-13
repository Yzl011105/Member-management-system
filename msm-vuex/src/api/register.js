import request from '@/utils/request'//引入封装好的request

export function register(username, nickname, password) {//导出register方法
    return request({//返回一个request对象
        method: 'post',
        url: '/user/register',//这里拼的内容就是后端服务需要去判断的
        data:{
            username,
            nickname,
            password
        },
    })
}