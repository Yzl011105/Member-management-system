import Vue from "vue";
import VueRouter from "vue-router";
import Register from '../views/register';
import Login from '../views/login';
import Layout from '../components/Layout.vue'
import Home from '../views/home';
import Teacher from '../views/teacher';
import Student from '../views/student';

Vue.use(VueRouter);

const routes = [
  {
    path: '/register',//在路由里进行注册
    name: 'Register',
    component: Register,//引入的组件
  }, {
    path: '/login',
    name: 'Login',
    component: Login,
  }, {
    path: '/',//? / 默认会被忽略掉
    name: 'Layout',
    component: Layout,
    redirect:'/home',
    children: [{
      path: '/home',
      component: Home,
      meta: { title: 'ROOT' }
    }, {
      path: '/teacher',
      component: Teacher,
      meta: { title: 'Teacher' },
    }, {
      path: '/student',
      component: Student,
      meta: { title: 'Student' },
    }]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
