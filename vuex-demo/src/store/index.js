import Vue from "vue";
import Vuex from "vuex"// 引入 Vuex 插件
import home from "./module/home.js"

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        home
    }
})

export default store