//!判断前端发送过来的请求
var express = require('express');
var router = express.Router();//使用express框架下的路由就可以
var User = require('./user.js');
var md5 = require('blueimp-md5');//加密
var Teacher = require('./teacher.js');
var Student = require('./student.js');

//?注册
router.post('/user/register', function (req, res) {
    // console.log(req.body);
    // res.send('666');
    var body = req.body;
    User.find({//mongoose中提供的方法，在数据库中进行查找
        $or: [{//用 或条件 去查数据库
            username: body.username//判断新传入的username是否等于原数据库中存在的username
        }, {
            nickname: body.nickname
        }]
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error 查询失败'
            })
        }
        if (data.length !== 0) {//代表上面的username或者nickname有相同
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号或密码已存在'
            })
        }
        body.token = md5(md5(body.username) + 'yzl');//业务中加密两层 yzl为密钥
        new User(body).save(function (err, data) {//将body写到数据库中
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error 存储失败'
                })
            }
            return res.json({
                code: 2000,
                flag: true,
                message: '注册成功'
            })
        })
    })
})

//?登录
router.post('/user/login', function (req, res) {
    var body = req.body;
    User.findOne({//访问数据库
        username: body.username,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error',
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号不存在或密码错误',
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '登陆成功',
            data: {//同时将标志token传回去
                token: data.token//使用token来判断当前是否有登录，登录的是谁.
            }
        })
    })
})

//?获取用户信息
router.get('/user/info', function (req, res) {
    var body = req.query;//get方法，所以不用body
    User.findOne({
        token: body.token,
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 4000,
                flag: false,
                message: 'server error',
            })
        }
        if (!data) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: '账号信息不存在或已过期'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '获取用户信息成功',
            data: {
                nickname: data.nickname,
                username: data.username,
                id: data._id,//mongodb添加数据默认添加一项_id
            }
        })
    })
})

//?退出登录
router.post('/user/logout', function (req, res) {
    var body = req.body;
    User.findOne({//查询前端传过来的token是否存在
        token: body.token
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '账号已注销或已过期'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '退出系统成功'
        })
    })
})

//?校验原始密码是否正确
router.post('/user/pwd', function (req, res) {
    var body = req.body
    User.findOne({
        _id: body.userId,
        password: body.password
    }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '原始密码错误，请校验'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '密码正确',
        })
    })
})

//?修改账号密码
router.put('/user/pwd', function (req, res) {
    var body = req.body
    User.findOne({ _id: body.userId }, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        if (!data) {
            return res.status(200).json({
                code: 4000,
                flag: false,
                message: '密码错误'
            })
        }
        data.password = body.password//将数据库中查询出来的数据与request的数据进行替换
        User.findByIdAndUpdate(body.userId, data, function (err) {
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: '修改密码失败'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: '修改密码成功'
            })
        })
    })
})

//?获取所有教师列表
router.get('/teacher/list', function (req, res) {
    Teacher.find({}, function (err, data) {//因为要查询所有,所以条件可以不用写
        if (err) {
            res.status(500).json({
                code: 4000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '查找教师信息成功',
            data: {
                total: data.length,//后面涉及到分页问题，需要获取数组长度
                rows: data,
            }
        })
    })
})

//?修改教师信息(分页)
router.post('/teacher/list', function (req, res) {
    const body = req.body;
    //* 前端传入
    let page = body.page || 1;//如果传的时候没有值，默认值就为1.
    let size = body.size || 10;
    let searchMap = body.searchMap || {};
    //* 后端真正查询条件
    const obj = {};
    searchMap.jobnumber ? obj["jobnumber"] = searchMap.jobnumber : obj;
    //判断searchMap中是否有jobnumber这一项,如果存在就在obj中添加一项jobnumber等于searchMap.jobnumber,没有就为空.
    searchMap.name ? obj["name"] = searchMap.name : obj;
    searchMap.role ? obj["role"] = searchMap.role : obj;
    searchMap.entrydate ? obj["entrydate"] = searchMap.entrydate : obj;
    Teacher.find(obj, function (err, data) {//obj有内容就按照obj的内容去查询，没有内容就相当于空对象
        //todo find方法无论有没有条件,返回的都是数组.
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        let count = data.length;//查询到数据后,记录data中有多少数据.
        //*进行分页查询
        Teacher.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            //skip 跳过 limit 截取.
            //通过find查找, 拿到数据后进行skip，limit.这种写法无法写回调函数，通过exec方法来拿到返回值
            if (err) {
                res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: '成功查询! 查询信息如下',
                data: {
                    total: count,
                    rows: data
                }
            })
        })
    })
})

//?新增教师
router.post('/teacher', function (req, res) {
    var body = req.body;
    new Teacher(body).save(function (err) {//往mongo中添加数据 使用 new Teacher().save
        if (err) {//只需要判断是否存在,不需要将存的数据再返回来一遍
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '成功添加'
        })
    })
})

//?根据id查找一条教师信息
router.get('/teacher', function (req, res) {
    Teacher.findById(req.query.id, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据id查找教师信息成功',
            data: data
        })
    })
})

//?根据id修改一条教师信息(put方法,在使用上与post方法一样)
router.put('/teacher', function (req, res) {
    var id = req.body._id;//与前端传过来的key值要对应
    Teacher.findByIdAndUpdate(id, req.body, function (err) {//findByIdAndUpdate方法参数分别为,id,整个对象,方法
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '修改教师信息成功'
        })
    })
})

//?根据id删除一条教师信息(delete方法)
router.delete('/teacher', function (req, res) {
    // console.log(req.body);
    Teacher.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '删除教师信息成功'
        })
    })
})

//?获取学生信息(带分页)
router.post('/student/list', function (req, res) {
    //* 前端传入
    const body = req.body;
    let page = body.page || 1;
    let size = body.size || 10;
    let searchMap = body.searchMap || {};
    //* 后端真正的判定条件
    const obj = {};//将所有的查询条件放到obj中
    searchMap.stunum ? obj['stunum'] = searchMap.stunum : obj;
    searchMap.name ? obj['name'] = searchMap.name : obj;
    searchMap.teacher ? obj['teacher'] = searchMap.teacher : obj;
    searchMap.class ? obj['class'] = searchMap.class : obj;
    //这种写法,相当于给对象添加一个新的key,后边给key进行赋值,类似于添加新的属性.

    Student.find(obj, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        // 查询成功,进行分页
        const count = data.length;
        Student.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec(function (err, data) {
            //exec方法,等前边查询截取限制一系列操作完成之后,再进行回调.
            if (err) {
                return res.status(500).json({
                    code: 3000,
                    flag: false,
                    message: 'server error'
                })
            }
            return res.status(200).json({
                code: 2000,
                flag: true,
                message: '查找学生信息成功',
                data: {
                    total: count,//总共返回多少条数据
                    rows: data,//真正的data
                }
            })
        })
    })
})

//?新增学生
router.post('/students', function (req, res) {
    new Student(req.body).save(function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '新增学生信息成功'
        })
    })
})

//?根据id查找学生信息
router.get('/students', function (req, res) {
    Student.findById(req.query.id, function (err, data) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '根据ID查找学生信息成功',
            data: data//data是根据ID查找到的数据，返回去
        })
    })
})

//?根据id修改学员信息
router.put('/students', function (req, res) {
    Student.findByIdAndUpdate(req.body._id, req.body, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '修改学生信息成功'
        })
    })
})

//?根据id删除学生信息
router.delete('/students', function (req, res) {
    Student.findByIdAndRemove(req.body.id, function (err) {
        if (err) {
            return res.status(500).json({
                code: 3000,
                flag: false,
                message: 'server error'
            })
        }
        return res.status(200).json({
            code: 2000,
            flag: true,
            message: '删除学生信息成功'
        })
    })
})


module.exports = router;//将router作为一个对象导出