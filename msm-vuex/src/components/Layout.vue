<template>
    <div>
        <!-- 头部区域 -->
        <div class="header">
            <app-header />
        </div>
        <!-- 左侧导航 -->
        <div class="navbar">
            <app-navbar />
        </div>
        <!-- 右侧区域 -->
        <div class="main">
            <app-main />
        </div>
    </div>
</template>
<script>
import AppHeader from './AppHeader';
import AppMain from './AppMain';
import AppNavbar from './AppNavbar';
export default {
    data() {
        return {
        }
    },

    components: {
        AppHeader,
        AppMain,
        AppNavbar,
    },

    methods: {},

}
</script>
<style  scoped>
/* 头部 */
.header {
    position: absolute;
    line-height: 50px;
    padding: 0px;
    top: 0px;
    left: 0px;
    right: 0px;
    background-color: rgb(15, 15, 15);
}
/* 左侧导航 */
.navbar {
    position: absolute;
    width: 230px;
    top: 50px; /* 把上边header的部分让出来 */
    left: 0px;
    bottom: 0px;
    overflow-y: auto; /* 纵坐标滚动条 */
    background-color: rgb(56, 54, 55);
}
/* 右侧主体区域 */
.main {
    position: absolute;
    top: 50px;
    left: 230px; /* 把左边navbar的部分让出来 */
    right: 0px;
    bottom: 0px;
    overflow-y: auto;
    padding: 10px;
}
</style>
