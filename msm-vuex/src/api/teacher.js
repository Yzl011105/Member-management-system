import request from '@/utils/request.js'

export default {
    getList() {
        return request({
            url: '/teacher/list',
            method: 'get',
        })
    },
    search(page, size, searchMap) {//通过axios请求将这三个参数传到服务端
        return request({
            url: '/teacher/list',
            method: 'post',
            data: {
                page,//page 当前要查询的页码
                size,//size 每页显示条数
                searchMap//所有教师的所有项
            }
        })
    },
    add(teacher) {
        return request({
            url: '/teacher',
            method: 'post',
            data: teacher
        })
    },
    getById(id) {
        return request({
            url: `/teacher?id=${id}`,
            method: 'get'
        })
    },
    update(teacher) {
        return request({
            url: '/teacher',
            method: 'put',
            data: teacher
        })
    },
    deleteById(id) {
        return request({
            url: `/teacher`,
            method: 'delete',
            data: { id }
        })
    }
}