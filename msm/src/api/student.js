import request from '@/utils/request.js'

export default {
    //?带分页查找
    search(page, size, searchMap) {
        return request({
            url: '/student/list',
            method: 'post',
            data: {
                page,
                size,
                searchMap
            }
        })
    },
    //?新增学生信息
    add(pojo) {
        return request({
            url: '/students',
            method: 'post',
            data: pojo
            //pojo是对象，可以不放到大括号中.服务端拿数据的时候不需要再.data 直接可以通过res.body拿到数据
        })
    },
    //?查找学生信息
    getById(id) {
        return request({
            url: `/students?id=${id}`,
            method: 'get',
        })
    },
    //?修改学生信息
    update(pojo) {
        return request({
            url: '/students',
            method: 'put',
            data: pojo
        })
    },
    //?删除学生信息
    deleteById(id) {
        return request({
            url: '/students',
            method: 'delete',
            data: {
                id
            }
        })
    }
}