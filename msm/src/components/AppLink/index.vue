<template>
    <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item
                class="line"
                :to="{ path: $route.path }"
            >{{$route.meta.title}}
            </el-breadcrumb-item>
        </el-breadcrumb>
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
.el-breadcrumb {
    height: 10px;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 5px 5px 2px 0 #888888;
    background-color: #ffffff;
    cursor: pointer;
}
.line {
    border-left: 3px solid rgb(81, 211, 161);
    padding-left: 10px;
}
</style>
