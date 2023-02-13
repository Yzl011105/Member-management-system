//!读写数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stu');

//?定义规则对象
var Schema = mongoose.Schema;//声明mongoose下的一个规则
var userSchema = new Schema({//创建一个规则的对象，生成一个这样规则的实例
    username: {
        type: String,
        require: true
    },
    nickname: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    token: {
        type: String,
        require: true
    }
})
module.exports = mongoose.model('User', userSchema);//将整个mongoose作为对象导出,后面规则写实例的变量名来接