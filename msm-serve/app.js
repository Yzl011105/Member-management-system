//!后端服务的入口
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path')//引入path模块，使用它的绝对路径去开放路径
var app = express();
var router = require('./router.js');

app.use(bodyParser.urlencoded({ extends: false }));
app.use(bodyParser.json());//引入body-parser所必要的两行代码

app.use('/node_modules', express.static(path.join(__dirname, './node_modules')))
//开放路径node_modules,静态托管路径要变为绝对路径，__dirname拿到本地真正的路径

app.use(router);

app.listen(3000, function () {
    console.log('running....');
})