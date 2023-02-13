<template>
    <div>
        <app-link v-show="$route.path !=='/home'"></app-link><!-- 路径不等于/home的时候，显示组件 -->
        <router-view>
            <!-- 渲染子组件的出口 -->
        </router-view>
    </div>
</template>
<script>
import AppLink from '../AppLink';//声明变量的时候，不要使用Link，默认存在Link，使用会报错
export default {
    data() {
        return {
        }
    },

    components: {
        AppLink
    },

    methods: {},

}
</script>
<style  scoped>
</style>
