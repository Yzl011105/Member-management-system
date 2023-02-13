<template>
    <div class="home">
        <!-- 模块化之后需要.home.count获取数据 -->
        <h1>count:{{$store.state.home.count}}</h1>
        <button @click="add">加10</button>
        <button @click="subtraction">减10</button>
        派生属性:{{$store.getters.desc}}
    </div>
</template>

<script>
// @ is an alias to /src

export default {
    name: "Home",
    components: {
    },
    methods: {
        add() {
            // this.$store.commit('add', 10)//提交荷载
            // 触发 actions 中的 add 改变状态值
            this.$store.dispatch('add1', 10)
        },
        subtraction() {
            // this.$store.commit('subtraction', 10)
            this.$store.dispatch('subtraction1', 10)
        }
    }
};
</script>
