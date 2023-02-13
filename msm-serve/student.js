var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/stu');

var Schema = mongoose.Schema;
var userSchema = new Schema({
    stunum: {// 学号
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    admissionDate: {// 入学时间
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    teacher: {// 授课教师
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    job: {
        type: String,
        required: true
    },
    money: {// 薪资待遇
        type: String,
        required: true
    },
})

module.exports = mongoose.model('Student', userSchema);