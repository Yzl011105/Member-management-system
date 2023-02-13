//!读写数据库
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stu');

//?定义规则对象
var Schema = mongoose.Schema;//声明mongoose下的一个规则
var userSchema = new Schema({//创建一个规则的对象，生成一个这样规则的实例
    jobnumber: {//工号
        type: String,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    role: {//职位
        type: String,
        require: true
    },
    entrydate: {//入职时间
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    }
})
module.exports = mongoose.model('Teacher', userSchema);//默认去找表名为teachers