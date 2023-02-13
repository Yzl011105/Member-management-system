<template>
    <div>
        <!-- 行内表单 条件查找 -->
        <el-form
            :inline="true"
            :model="searchMap"
            ref="searchForm"
            style="margin-top:20px"
        >
            <el-form-item prop='stunum'>
                <!-- 绑定prop才可以使用 -->
                <el-input
                    v-model="searchMap.stunum"
                    placeholder="学号"
                ></el-input>
            </el-form-item>
            <el-form-item prop='name'>
                <el-input
                    v-model="searchMap.name"
                    placeholder="姓名"
                ></el-input>
            </el-form-item>
            <el-form-item prop='teacher'>
                <el-input
                    v-model="searchMap.teacher"
                    placeholder="授课教师"
                    readonly
                    @click.native="dialogTeacherVisible = true"
                ></el-input><!-- @click.native是原生点击事件 -->
            </el-form-item>
            <el-form-item prop='class'>
                <el-input
                    v-model="searchMap.class"
                    placeholder="班级"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="searchData"
                >查询</el-button>
                <el-button
                    type="primary"
                    @click="handleAdd"
                >新增</el-button>
                <el-button
                    type="primary"
                    @click="resetData('searchForm')"
                >重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 学生列表 -->
        <el-table
            :data="tableData"
            height="380"
            border
            style="width: 100%"
        >
            <!-- 绑定序号时,可以传index作为prop的键值,但用这种方法,就需要用type作键名 -->
            <el-table-column
                type="index"
                label="序号"
                width="80"
            >
            </el-table-column>
            <el-table-column
                prop="stunum"
                label="学号"
                width="80"
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="100"
            >
            </el-table-column>
            <el-table-column
                prop="admissionDate"
                label="入学时间"
                width="200"
            >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="电话"
                width="120"
            >
            </el-table-column>
            <el-table-column
                prop="teacher"
                label="教师"
                width="100"
            >
            </el-table-column>
            <el-table-column
                prop="class"
                label="班级"
                width="80"
            >
            </el-table-column>
            <el-table-column
                prop="job"
                label="工作去向"
                width="180"
            >
            </el-table-column>
            <el-table-column
                prop="money"
                label="薪资待遇"
                width="80"
            >
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        @click="handleEdit(scope.row._id)"
                    >编辑</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        @click="handleDelete(scope.row._id)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页功能 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.currentPage"
            :page-sizes="[5, 10, 20]"
            :page-size="this.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="this.total"
        >
        </el-pagination>

        <!-- 教师信息弹窗 -->
        <el-dialog
            title="选择教师"
            :visible.sync="dialogTeacherVisible"
            width="30%"
        >
            <teacher
                :isDialog='true'
                @option-teacher='optionTeacher'
            ></teacher>
        </el-dialog>

        <!-- 学生新增或编辑 弹窗 -->
        <el-dialog
            title="学员编辑"
            :visible.sync="dialogFormVisible"
            width="500px"
        >
            <el-form
                :model="pojo"
                :rules="rules"
                ref="pojoForm"
                label-width="100px"
                label-position="right"
                style="wideth=400px"
            >
                <el-form-item
                    label="学号"
                    prop="stunum"
                >
                    <el-input v-model="pojo.stunum"></el-input>
                </el-form-item>
                <el-form-item
                    label="姓名"
                    prop="name"
                >
                    <el-input v-model="pojo.name"></el-input>
                </el-form-item>
                <el-form-item
                    label="授课教师"
                    prop="teacher"
                >
                    <el-input
                        v-model="pojo.teacher"
                        readonly
                        @click.native='dialogOptionTeacher'
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="班级"
                    prop="class"
                >
                    <el-input v-model="pojo.class"></el-input>
                </el-form-item>
                <el-form-item
                    label="入学时间"
                    prop="admissionDate"
                >
                    <el-date-picker
                        v-model="pojo.admissionDate"
                        type="date"
                        placeholder="选择日期"
                        value-format='yyyy-MM-dd'
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="联系方式"
                    prop="phone"
                >
                    <el-input v-model="pojo.phone"></el-input>
                </el-form-item>
                <el-form-item
                    label="工作去向"
                    prop="job"
                >
                    <el-input v-model="pojo.job"></el-input>
                </el-form-item>
                <el-form-item
                    label="薪资"
                    prop="money"
                >
                    <el-input v-model="pojo.money"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        @click="pojo._id===null?addData('pojoForm'):updateData('pojoForm')"
                    >提交</el-button>
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>

    </div>
</template>
<script>
import studentApi from '@/api/student.js'//导入Api
import Teacher from '@/views/teacher'//将教师作为子组件导入
export default {
    data() {
        return {
            tableData: [],// 学生列表
            currentPage: 1,// 默认第一页
            pageSize: 10,// 每页默认分十条
            searchMap: {
                stunum: '',
                name: '',
                teacher: '',
                class: '',
            },
            total: 0,// 总记录数
            pojo: {
                _id: null,
                stunum: '',
                name: '',
                teacher: '',
                class: '',
                admissionDate: '',
                phone: '',
                job: '',
                money: '',
            },
            dialogTeacherVisible: false,// 控制教师弹出框
            dialogFormVisible: false,// 控制学生信息新增、编辑弹窗
            rules: {
                stunum: [{ required: true, message: '学号不能为空', trigger: 'blur' }],
                name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
                phone: [{ required: true, message: '电话不能为空', trigger: 'blur' }]
            },
            isEdit: false
        }
    },

    components: { Teacher },

    created() {
        this.fetchData()
    },

    methods: {
        updateData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    studentApi.update(this.pojo).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();
                            this.dialogFormVisible = false;
                            this.$message({
                                message: resp.message,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: resp.message,
                                type: 'error'
                            })
                        }
                    })
                } else {
                    return false
                }
            })
        },
        addData(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //验证通过
                    studentApi.add(this.pojo).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();
                            this.dialogFormVisible = false
                            this.$message({
                                message: resp.message,
                                type: 'success'
                            })
                        } else {
                            //验证不通过
                            this.$message({
                                message: '你好',
                                type: 'warning'
                            })
                        }
                    })
                } else {
                    return false
                }
            })
        },
        dialogOptionTeacher() {
            this.dialogTeacherVisible = true;
            this.isEdit = true
        },
        handleAdd() {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs['pojoForm'].resetFields();
            })
        },
        optionTeacher(correntRow) {//如果有correntRow，就把他放到查找框去
            if (this.isEdit) {//学生修改弹窗
                this.pojo.teacher = correntRow.name
            } else {//教师列表弹窗
                this.searchMap.teacher = correntRow.name;
            }
            this.isEdit = false
            this.dialogTeacherVisible = false;
        },
        fetchData() {
            studentApi.search(this.currentPage, this.pageSize, this.searchMap
            ).then(response => {
                this.tableData = response.data.data.rows;
                this.total = response.data.data.total;
            })
        },
        resetData(formName) {
            this.$refs[formName].resetFields();
            this.fetchData();
        },
        searchData() {
            this.currentPage = 1;
            this.fetchData();
        },
        handleEdit(id) {
            // console.log(id);
            this.handleAdd();//调用handleAdd方法，当用户点击编辑按钮时，产生弹窗
            studentApi.getById(id).then(response => {
                const resp = response.data
                // console.log(resp);
                if (resp.flag) {
                    this.pojo = resp.data
                }
            })
        },
        handleDelete(id) {
            this.$confirm('此操作将永久删除该学员信息, 是否继续?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                studentApi.deleteById(id).then(response => {
                    const resp = response.data;
                    this.$message({//不论成功失败都进行message的提示
                        message: resp.message,
                        type: resp.flag ? 'success' : 'error'
                    })
                    if (resp.flag) {//删除成功，刷新列表
                        this.fetchData();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.fetchData();
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.fetchData();
        },
    },

}
</script>
<style  scoped>
.el-table {
    margin-top: 20px;
}
</style>
