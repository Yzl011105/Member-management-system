<template>
    <div>
        <a href="/">
            <img
                class="logo"
                src="@/assets/logo.png"
                width="25px"
            >
            <span style="color:#ffffff;">成员管理系统</span>
        </a>
        <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
                {{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">修改密码</el-dropdown-item>
                <el-dropdown-item command="b">退出系统</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <!-- 修改密码弹出窗 -->
        <el-dialog
            title="修改密码"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <!-- 属性值要用双引号 -->
            <el-form
                :model="ruleForm"
                style="width:400px"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
            >
                <el-form-item
                    label="原始密码"
                    prop="oldPass"
                >
                    <el-input
                        v-model="ruleForm.oldPass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="新密码"
                    prop="pass"
                >
                    <el-input
                        v-model="ruleForm.pass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="确认密码"
                    prop="checkPass"
                >
                    <el-input
                        type="password"
                        v-model="ruleForm.checkPass"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="submitForm('ruleForm')"
                    >提交</el-button>
                    <el-button @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { logout } from '@/api/logout.js'
import passwordApi from '@/api/password.js'
export default {
    data() {
        var validateoldPass = (rule, value, callback) => {
            //id可以通过本地储存中获取到，之前将id，token等内容作为对象保存到了localStorage中
            passwordApi.checkPwd(this.user.id, value).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    callback();
                } else {
                    callback(new Error(resp.message))
                }
            })
        };
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.ruleForm.pass) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };
        return {
            dialogFormVisible: false,
            // user: JSON.parse(localStorage.getItem('stu-user')),
            //获取本身为字符串，通过.parse()将字符串转换为对象.这样上面才能获取到nickname
            user: this.$store.state.user.user,//前一个user代表组件化名称
            ruleForm: {
                oldPass: '',
                pass: '',
                checkPass: ''
            },
            rules: {
                oldPass: [
                    { required: true, message: '原始密码不能为空', },
                    { validator: validateoldPass, trigger: 'blur' }
                ],
                pass: [
                    { required: true, message: '新密码不能为空', trigger: 'blur' }
                ],
                checkPass: [
                    { required: true, message: '校验密码不能为空', },
                    { validator: validatePass2, trigger: 'blur' }
                ],
            }
        }
    },

    components: {},

    methods: {
        handlepwd() {
            this.dialogFormVisible = true
            this.$nextTick(() => {//渲染结束后重置表单
                this.$refs['ruleForm'].resetFields()
            })
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    passwordApi.updatePwd(this.user.id, this.ruleForm.pass).then(response => {
                        const resp = response.data
                        this.$message({
                            message: resp.message,
                            type: resp.flag ? 'success' : 'error'
                        })
                        if (resp.flag) {
                            this.handleLogout();//强制下线
                            this.dialogFormVisible = false
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        handleLogout() {
            this.$router.push('/login');
        },
        handleCommand(command) {
            // this.$message('click on item ' + command);
            switch (command) {
                case 'a'://修改密码
                    this.handlepwd();
                    break;
                case 'b'://退出登录
                    this.$store.dispatch('Logout').then(response => {
                        this.$router.push('login')
                    })
                    break;
            }
        }
    }
}
</script>
<style  scoped>
.logo {
    padding: 0 10px 0 40px;
    vertical-align: middle;
}
.el-dropdown-link {
    cursor: pointer;
    color: #f3f3f3;
}
.el-icon-arrow-down {
    font-size: 12px;
    cursor: pointer;
}
.el-dropdown {
    float: right;
    margin-right: 40px;
}
</style>
