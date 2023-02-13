<template>
    <div>
        <!-- 条件查询 -->
        <el-form
            :inline="true"
            :model="searchMap"
            ref="searchForm"
            class="demo-form-inline"
        >
            <el-form-item prop="jobnumber">
                <el-input
                    v-if='!isDialog'
                    v-model="searchMap.jobnumber"
                    placeholder="工号"
                ></el-input><!-- 当 v-if = false 的时候，才不去渲染，所以取反 -->
            </el-form-item>
            <el-form-item prop="name">
                <el-input
                    v-model="searchMap.name"
                    placeholder="姓名"
                ></el-input>
            </el-form-item>
            <el-form-item prop="role">
                <el-select
                    v-if='!isDialog'
                    v-model="searchMap.role"
                    placeholder="教师职务"
                >
                    <!-- 循环 绑定相应数据 -->
                    <el-option
                        v-for="option in roleOptions"
                        :key="option.type"
                        :label="option.name"
                        :value="option.type"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="entrydate">
                <span class="demonstration"></span>
                <!-- 使用 value-format 保证格式与数据库中一致 -->
                <el-date-picker
                    v-if='!isDialog'
                    value-format="yyyy-MM-dd"
                    v-model="searchMap.entrydate"
                    type="date"
                    placeholder="入职时间"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button
                    type="primary"
                    @click="searchData"
                >查询</el-button>
                <el-button
                    v-if='!isDialog'
                    type="primary"
                    @click="handleAdd()"
                >新增</el-button>
                <el-button
                    type="primary"
                    @click="resetForm('searchForm')"
                >重置</el-button>
            </el-form-item>
        </el-form>
        <!-- 教师列表 -->
        <!-- highlight-current-row 激活单选行, isDialog为true时激活
        @current-change 当点击某一行后,会触发这个事件,从而调用对应的函数clickCurrentChange
        clickCurrentChange函数会接收两个参数:currentRow，oldCurrentRow
        -->
        <el-table
            :data="tableData"
            height="300"
            border
            style="width: 100%"
            class="table"
            :highlight-current-row="isDialog"
            @current-change="clickCurrentChange"
        >
            <el-table-column
                type="index"
                label="序号"
                width="80"
            >
                <!-- 用index绑定序号的时候，前边不能用prop，而需要用type -->
            </el-table-column>
            <el-table-column
                prop="jobnumber"
                label="工号"
                width="180"
                v-if='!isDialog'
            >
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                width="180"
            >
            </el-table-column>
            </el-table-column>
            <el-table-column
                prop="role"
                label="职位"
                width="180"
            >
                <template slot-scope="scope">
                    <span>{{scope.row.role | roleFilter}}</span>
                </template>
            </el-table-column>
            </el-table-column>
            <el-table-column
                prop="entrydate"
                label="入职时间"
                width="180"
                v-if='!isDialog'
            >
            </el-table-column>
            <el-table-column
                prop="phone"
                label="联系方式"
                width="180"
                v-if='!isDialog'
            >
            </el-table-column>
            <el-table-column
                v-if='!isDialog'
                label="操作"
            >
                <!--
                    在Element-ui中，要在某一个元素中放一个按钮的话，
                    需要在按钮外面套一层template标签，因为element框架封装时的要求.
                -->
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
            :layout="
            isDialog ? 'prev,pager,next':'total, sizes, prev, pager, next, jumper'
            "
            :total="this.total"
        >
        </el-pagination>
        <!-- 新增教师弹窗 -->
        <el-dialog
            title="教师信息编辑"
            :visible.sync="dialogFormVisible"
            width='500px'
        >
            <!-- :visible.sync 控制弹窗 -->
            <el-form
                :model="teacher"
                ref="teacherForm"
                label-width='100px'
                label-position='right'
                style="width:400px"
                :rules='rules'
            >
                <el-form-item
                    label="工号"
                    prop='jobnumber'
                >
                    <el-input
                        v-model="teacher.jobnumber"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="姓名"
                    prop='name'
                >
                    <el-input
                        v-model="teacher.name"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
                <el-form-item
                    label="职务"
                    prop='role'
                >
                    <el-select
                        v-model="teacher.role"
                        placeholder="请选择..."
                    >
                        <el-option
                            v-for="option in roleOptions"
                            :key="option.type"
                            :label="option.name"
                            :value="option.type"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item
                    prop="entrydate"
                    label='入职时间'
                >
                    <span class="demonstration"></span>
                    <!-- 使用 value-format 保证格式与数据库中一致 -->
                    <el-date-picker
                        value-format="yyyy-MM-dd"
                        v-model="teacher.entrydate"
                        type="date"
                        placeholder="入职时间"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    label="电话"
                    prop='phone'
                >
                    <el-input
                        v-model="teacher.phone"
                        autocomplete="off"
                    ></el-input>
                </el-form-item>
            </el-form>
            <div
                slot="footer"
                class="dialog-footer"
            >
                <el-button
                    type="primary"
                    @click=" teacher._id === null ? addData('teacherForm') : updateData('teacherForm')"
                >确 定</el-button><!-- 通过判断id是否为空来进行新增功能或者编辑功能 -->
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>

</template>
<script>
import teacherApi from '@/api/teacher.js'//因为在teacher.js中默认导出对象,所以接受的时候就不能用大括号的形式去接收
const roleOptions = [//全局定义职位类型的数组
    {
        type: '1', name: '班主任'
    },
    {
        type: '2', name: '数学老师'
    },
    {
        type: '3', name: '语文老师'
    },
    {
        type: '4', name: '英语老师'
    }
];
export default {
    data() {
        return {
            rules: {
                jobnumber: [{ required: true, message: '请输入工号', trigger: 'blur' }],
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }]
            },
            tableData: [],
            total: 0,
            currentPage: 1,
            pageSize: 10,
            searchMap: {//所有教师的所有项
                jobnumber: '',
                name: '',
                role: '',
                entrydate: ''
            },
            roleOptions,
            teacher: {
                _id: null,
                jobnumber: '',
                name: '',
                role: '',
                entrydate: '',
                phone: ''
            },
            dialogFormVisible: false//弹窗
        }
    },
    filters: {//过滤器
        roleFilter(type) {
            const obj = roleOptions.find(item => item.type === type)//箭头函数后边是查询条件 find方法中是function
            /* 表示数组中某一项的type如果与传进来的type一致,就把这项返回 */
            return obj ? obj.name : null;//三元表达式，如果没有obj就返回空值
        }
    },
    components: {},
    props: {// 父组件中传递的 isDialog 值通过子组件中 props 接收
        // 接收父组件传递过来 的数据,通过isDialog来判断 是否为弹框
        // 如果为 true, 则是弹框, false 就是列表
        isDialog: Boolean
    },
    created() {
        this.fetchData();//在钩子函数中调用下面写的方法
    },
    methods: {
        clickCurrentChange(correntRow) {// 当点击某一行时,会调用这个函数进行处理
            // 点击后,要将点击的数据传递到父组件,
            // 则可以通过触发父组件中的option-teacher, 触发之后 ,
            //父组件可以在 option-teacher 这个事件对应的处理函数中进行接收数据currentRow
            this.$emit('option-teacher', correntRow)
        },
        updateData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    teacherApi.update(this.teacher).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();//刷新列表数据
                            this.dialogFormVisible = false;//关闭窗口
                            this.$message({
                                message: resp.message,
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: resp.message,
                                type: 'warning'
                            })
                        }
                    })
                } else {
                    return false;
                }
            })
        },
        addData(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //向数据库中添加数据，成功后重新查询刷新列表
                    // alert('submit!');
                    teacherApi.add(this.teacher).then(response => {
                        const resp = response.data;
                        if (resp.flag) {
                            this.fetchData();//新增成功,刷新列表数据
                            this.dialogFormVisible = false;//添加完成后,自动关闭弹窗
                            this.$message({
                                message: '添加教师信息成功',
                                type: 'success'
                            })
                        } else {
                            this.$message({
                                message: resp.message,
                                type: 'warning'
                            })
                        }
                    })
                } else {
                    //返回添加失败提示
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        handleAdd() {
            this.dialogFormVisible = true;
            // this.$refs['teacherForm'].resetFields();
            /* 直接调用方法的时候,DOM层渲染的窗口没加载出来,表单也就没有生成,
            但是this.$的方法是异步加载的,表单未加载出来的时候重置功能就开始执行,找不到表单实例,所以控制台会报错 */
            this.$nextTick(() => {
                this.$refs['teacherForm'].resetFields();
            })
            /* this.$nextTick()它是一个异步事件，当渲染结束之后 ，它的回调函数才会被执行
            弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式*/
        },
        handleEdit(id) {
            // console.log('edit', id);
            this.handleAdd();
            teacherApi.getById(id).then(response => {
                const resp = response.data;
                if (resp.flag) {
                    this.teacher = resp.data;
                }
            })
        },
        handleDelete(id) {
            // console.log('delete', id);
            this.$confirm('确认删除这条数据吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {//点击`确定`
                teacherApi.deleteById(id).then(response => {
                    this.$message({
                        type: response.data.flag ? 'success' : 'error',
                        message: response.data.message
                    });
                    if (response.data.flag) {
                        this.fetchData();//将数据库中新的数据再获取一遍
                    }
                })
            }).catch(() => {//点击`取消`
                this.$message({
                    message: '已取消删除',
                    type: 'info'
                })
            });
        },
        searchData() {
            this.currentPage = 1;//将页码设置回1，防止后台只查询到1条数据，但是却返回其他页码，从而数据返回空
            this.fetchData();
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.fetchData();
        },
        fetchData() {
            teacherApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
                const resp = response.data;
                // console.log(resp);
                this.tableData = resp.data.rows;
                this.total = resp.data.total;//记录读取多少条
            })
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
        }
    }
}
</script>
<style  scoped>
.demo-form-inline {
    position: relative;
    top: 10px;
}
</style>