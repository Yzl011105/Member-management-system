//!测试文件,写相应方法去请求文件,之后输出
import request from "@/utils/request";//@代表 /src

//* 直接调用get,后边加路径,去访问相应的数据文件
// request.get('/db.json').then(response => {//public下的文件可以直接读
//     console.log('get1', response.data);
// }).catch(error => {
//     console.log(error.message);
// })

//* 对request进行对象的配置,然后去访问数据文件
request({
    url: '/db.json',
    method: 'get',
}).then((response) => {
    console.log('get2', response.data);
}).catch(error => {
    console.log(error.message);
})

export default {//?导出默认成员,默认成员是个对象,对象里写了getList方法
    getList() {
        const req = request({
            url: '/db.json',
            method: 'get',
        })

        return req;//这个req就是配置好相关内容的axios对象
    }
}