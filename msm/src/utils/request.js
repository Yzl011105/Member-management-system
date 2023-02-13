//! axios封装
import axios from "axios";//引入axios
//* 对axios自己进行封装,对axios进行改写 通过axios.create的方式去创建我们的axios对象,然后把axios作为对象传出去 */
//* 在其他的需要调用axios的地方去写一个方法,用axios去读数据,然后再去调用相应的方法去读文件 */
//* 之所以用封装的方式是为了可以加拦截器 */

//! element按需引入
import { Loading, Message } from 'element-ui';

// 加载数据时打开和关闭动效对象
const loading = {//创建loading对象，在里面添加属性和方法，在方法中调用service添加配置
    LoadingInstance: null,//Loading对象实例，通过它作为判断条件.
    /* loadingService实例是常驻的，每次调用需要将之前的loading释放或置空，每次使用时创建一个新的 */
    open: function () {//生成loading实例，将遮罩层打开
        if (this.LoadingInstance === null) {
            // 创建单例, 防止切换路由重复加载
            this.LoadingInstance = Loading.service({
                text: '拼命加载中',
                background: 'raga(0,0,0,0.5)',//加载效果
                target: '.main',//效果显示区域
                /* 	Loading 需要覆盖的 DOM 节点。可传入一个 DOM 对象或字符串；
                若传入字符串，则会将其作为参数传入 document.querySelector以获取到对应 DOM 节点
                这里找到AppMain组件*/
            })
        }
    },
    close: function () {//关闭loading实例，将实例对象置空
        if (this.LoadingInstance !== null) {
            this.LoadingInstance.close();//关闭遮罩层
        }
        this.LoadingInstance = null;//调用关闭方法，不能置空，需要手动置空
    }
}

const request = axios.create({//?创建一个axios对象,在对象里对axios的请求进行相关的配置
    // baseURL: '/',//?决定了你最终发送的请求是什么 baseURL里的内容会拼在你的端口号后边
    //? 根据不同环境设置baseURL,最终发送请求时URL为: baseURL+发送请求时的URL
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,//请求超时
})

//* 请求拦截器
request.interceptors.request.use(config => {
    // 请求拦截
    loading.open();//只有在发送请求时，需要遮罩效果
    return config
}, error => {
    // 出现异常,抛出错误对象
    loading.close();
    return Promise.reject(error);
})
//* 响应拦截器
request.interceptors.response.use(response => {
    // response.data
    loading.close();
    const resp = response.data;
    // 如果后台响应状态码不是 2000 , 说明后台服务有异常,统一可在此处处理
    if (resp.code !== 2000) {
        Message({
            message: resp.message || '系统异常',
            type: 'warning',
            duration: 5000,//提示存在时间
        })
    }
    return response
}, error => {
    loading.close();
    // 当请求接口出错时, 进行弹出错误提示, 如 404, 500, 请求超时
    Message({
        message: resp.message,
        type: 'error',
        duration: 5000,
    })
    return Promise.reject(error);
})

export default request;//将axios作为默认的成员对象导出