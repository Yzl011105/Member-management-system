//! 生成vue实例 相当于项目整个的入口
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import ElementUi from 'element-ui';//引入element-ui
import 'element-ui/lib/theme-chalk/index.css';//引入element-ui必需的css文件
import './premission.js';
import store from './store'

Vue.config.productionTip = false;
Vue.use(ElementUi);//使用element-ui

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
