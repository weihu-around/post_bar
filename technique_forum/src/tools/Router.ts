// 模块导入
import { Router, createRouter, createWebHashHistory } from 'vue-router'
import store from '../tools/Store'
import Layout from '../components/layout/Layout.vue'
import Login from '../components/login/Login.vue'
import SignUp from '../components/login/SignUp.vue'
import Home from '../components/home/Home.vue'
import PublishPost from '../components/home/PublishPost.vue'
import PostDetail from  '../components/post/PostDetail.vue'
import SearchPage from '../components/home/SearchPage.vue'

// 创建路由对象
const router:Router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: Layout,
            name: "Layout",
            children: [
                {
                    path: 'home',
                    component: Home,
                    name: "home"
                },
                {
                    path: 'login',
                    component: Login,
                    name: "login"
                },
                {
                    path: 'sign',
                    component: SignUp,
                    name: "sign"
                },
                {
                    path: '/publish/:category_id', // 发布页面,
                    component: PublishPost,
                    name: "publish",
                    props: true
                },
                {
                    path: '/post/:id', // 帖子详情页,
                    component: PostDetail,
                    name: "detail",
                    props: true
                },
                {
                    path: '/search/:keyword', // 帖子搜索结果,
                    component: SearchPage,
                    name: "search",
                    props: true
                }
            ]
        },
        
    ]
})

// 创建前置路由守卫
router.beforeEach((from)=>{
    // 获取登录状态
    const isLogin = store.getters.isLogin;
    // 如果是登录或者访问的是登录注册模块的页面，再允许
    if (isLogin || from.name == 'login' || from.name == 'sign') {
        return true
    } else {
        // 未登录时访问其他页面都跳转到登录页面
        return { name: 'login' }
    }
})

export default router;
