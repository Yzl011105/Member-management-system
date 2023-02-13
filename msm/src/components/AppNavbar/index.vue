<template>
    <div>
        <el-menu
            :router='true'
            :default-active="$route.path"
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
        >
            <el-menu-item index="/home">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/teacher">
                <i class="el-icon-s-custom"></i>
                <span slot="title">教师管理</span>
            </el-menu-item>
            <el-menu-item index="/student">
                <i class="el-icon-s-check"></i>
                <span slot="title">成员管理</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>
<script>
export default {
    data() {
        return {
        }
    },

    components: {},

    methods: {},

}
</script>
<style  scoped>
.el-menu {
    /* element-ui 里面的标签相当于类名，不能用标签选择器 */
    border-right: none;
}
</style>
