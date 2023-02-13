module.exports = {//输出出口,输出一个对象
    devServer: {//对devServer进行配置
        port: 8888,//端口改为8888
        host: 'localhost',
        https: false,//不使用https协议
        open: true,//自动打开浏览器
        proxy: {//?解决跨域问题(不符合浏览器同源规则),代理配置
            [process.env.VUE_APP_BASE_API]: {//特殊写法,方括号阔着
                target: process.env.VUE_APP_SERVICE_URL,//访问目标服务器
                changeOrigin: true,//开启代理,会创建虚拟服务器,就接受发送相应请求来请求数据
                pathRewrite: {//对路径进行重写
                    ['^' + process.env.VUE_APP_BASE_API]: ''//表示如果我的url有dev-api就把它替换成一个空串
                    //? 如 /dev-api/db.json 代理为 http://localhost:8080/db.json
                    //拼串的方式 重构代理
                }
            }
        }
    },
    lintOnSave: false,//eslint-loader 是否在保存的时候检查
    productionSourceMap: false,//不生成.js.map的文件eslint-loader 是否在保存的时候检查
}