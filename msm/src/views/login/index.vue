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
                    login(this.form.username, this.form.password).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            // console.log(resp);
                            getUserInfo(resp.data.token).then(response => {
                                const respUser = response.data;
                                // console.log(respUser);
                                localStorage.setItem('stu-token', resp.data.token);
                                localStorage.setItem('stu-user', JSON.stringify(respUser.data))//转换对象为字符串
                                this.$router.push('/');//用编程式的方式将路由的地址修改
                            })
                            this.$message({
                                message: resp.message,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: resp.message,
                                type: 'error',
                            })
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
span{
    font-size: 25px;
}
a{
    cursor: pointer;
    text-decoration: underline;
}
a:hover{
    color: red;
}

</style>
