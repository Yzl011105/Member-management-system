<template>
    <div class='register-container'>
        <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-width="100px"
            class="register-form"
        >
            <h2 class="register-title">注册</h2>
            <el-form-item
                label="账号"
                prop="username"
            >
                <!-- 双向绑定 账号绑定username, -->
                <el-input v-model="form.username">
                </el-input>
            </el-form-item>
            <el-form-item
                label="昵称"
                prop="nickname"
            >
                <!-- 双向绑定 账号绑定username, -->
                <el-input v-model="form.nickname">
                </el-input>
            </el-form-item>
            <el-form-item
                label="密码"
                prop="password"
            >
                <el-input
                    type="password"
                    v-model="form.password"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="确认密码"
                prop="checkPass"
            >
                <el-input
                    type="password"
                    v-model="form.checkPass"
                    autocomplete="off"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitForm('form')"
                >提交</el-button>
                <span>|</span>
                <a @click="goLogin">返回登录界面</a>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { register } from '@/api/register'
export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码'));
            } else {
                if (this.form.checkPass !== '') {
                    this.$refs.form.validateField('checkPass');
                }
                callback();
            }
        };
        var validatePass2 = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码'));
            } else if (value !== this.form.password) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            form: {
                username: '',
                nickname: '',
                password: '',
                checkPass: '',
            },
            rules: {//判断规则
                username: [{ required: 'true', message: '账号不能为空', trigger: 'blur' }],//required:这一项是必需的
                nickname: [{ required: 'true', message: '昵称不能为空', trigger: 'blur' }],
                password: [
                    { validator: validatePass, trigger: 'blur' }//触发条件:失焦
                ],
                checkPass: [
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }
        }
    },

    components: {},

    methods: {
        submitForm(formName) {/* 形参  */
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // alert('注册成功!');
                    register(this.form.username, this.form.nickname, this.form.password).then(response => {//调用数据库
                        // console.log(response.data);//输出从服务器上拿来的数据
                        const resp = response.data;//将后端服务器返回的内容接收一下
                        if (resp.flag) {
                            // console.log('注册成功');
                            this.$message({
                                message: resp.message,
                                type: 'success'
                            })
                            this.$router.push('/login')
                        } else {
                            this.$message({//类似于windows中的alert方法
                                message: resp.message,
                                type: 'warning'//以警告的方式
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        goLogin() {
            this.$router.push('/login');
        }
    }
}
</script>

<style  scoped>
.register-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden; /*溢出隐藏*/
    background: url(../../assets/register.jpg);
    background-size: cover;
}
.register-form {
    width: 350px;
    height: 300px;
    margin: 150px auto;
    background-color: rgb(227, 233, 238, 0.5);
    padding: 70px;
    border-radius: 20px; /* 设置圆角 */
}
.register-title {
    text-align: center;
}
span {
    font-size: 25px;
}
a {
    cursor: pointer;
    text-decoration: underline;
}
a:hover {
    color: blue;
}
</style>
