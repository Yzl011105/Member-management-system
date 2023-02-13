<template>
    <div class="login-container">
        <el-form
            :model="form"
            status-icon
            :rules="rules"
            ref="form"
            label-width="100px"
            class="login-form"
        >
            <h2 class="login-title">登录</h2>
            <el-form-item
                label="账号"
                prop="username"
            >
                <!-- 双向绑定 账号绑定username, -->
                <el-input v-model="form.username">
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
            <el-form-item>
                <el-button
                    type="primary"
                    @click="submitForm('form')"
                >登录</el-button>
                <span>|</span>
                <a @click="goRegister">点击注册</a><!-- 提交的参数是form -->
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { login, getUserInfo } from '@/api/login.js';
/*  读数据库，引入login
    读用户数据， 引入getUserInfo*/
export default {
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            rules: {//判断规则
                username: [{ required: 'true', message: '账号不能为空', trigger: 'blur' }],//required:这一项是必需的
                password: [{ required: 'true', message: '密码不能为空', trigger: 'blur' }],
            }
        }
    },

    components: {},

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$store.dispatch('Login', this.form).then(response => {
                        if (response.flag) {//response已经是response.data了 所以直接可以拿到flag
                            this.$router.push('/')
                            //信息存储在promise对象中做了，这里只需要做路由跳转就可以了
                            //并且之前的message提示，也做了统一异常处理.
                        }
                    })
                } else {
                    console.log('error submit');
                    return false;
                }
            })
        },
        goRegister() {
            this.$router.push('/register');
        }
    },

}
</script>
<style  scoped>
.login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden; /*溢出隐藏*/
    background: url(../../assets/login.jpg);
    background-size: cover;
}
.login-form {
    width: 350px;
    height: 300px;
    margin: 150px auto;
    background-color: rgb(227, 233, 238, 0.5);
    padding: 70px;
    border-radius: 20px; /* 设置圆角 */
}
.login-title {
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
    color: red;
}
</style>
