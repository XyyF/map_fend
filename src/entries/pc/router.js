import VueRouter from 'vue-router';

/**
 * 深度链接query参数说明：
 * {string} tab_section 进入页面后让header_tab切换到指定页面。取值为utils/enums中的各xxxSectionEnum值
 * {string} page 页面中表格的页码，从1开始
 * {string} search 进入页面后立即搜索该字符串
 * {string} dlg 进入页面后立即弹出窗口。取值为dialog_type
 * {string} data_id 进入页面后立即展开表格的某一行数据。具体解析方式由对应页面的index.vue文件决定
 * {string} sub_page 进入页面后立即展开表格的某一行数据后要进入的子页面。取值为utils/enums中的各xxxSubPage值
 * {string} filter_xxx 进入页面后对表格的xxx列设置筛选项。具体解析方式由对应页面的index.vue文件决定
 * {string} op 进入页面后立即执行点击某按钮的行为。取值由对应页面的index.vue文件决定
 */

// 注释里的是分块js名，加workbench_前缀是为避免和某个入口或chunk同名，否则会无法运行
const page404 = r => import(/* webpackChunkName: "workbench_404" */'./pages/404.vue').then(r)
// const indexPage = r => import(/* webpackChunkName: "workbench_index" */'./pages/main/index.vue').then(r)
const map = r => import(/* webpackChunkName: "workbench_index" */'./pages/map/index.vue').then(r)
const user = r => import(/* webpackChunkName: "workbench_index" */'./pages/user/index.vue').then(r)
const login = r => import(/* webpackChunkName: "workbench_index" */'./pages/user/login.vue').then(r)
const register = r => import(/* webpackChunkName: "workbench_index" */'./pages/user/register.vue').then(r)
const editName = r => import(/* webpackChunkName: "workbench_index" */'./pages/user/components/edit_name.vue').then(r)
const editPhone = r => import(/* webpackChunkName: "workbench_index" */'./pages/user/components/edit_phone.vue').then(r)
const editPassword = r => import(/* webpackChunkName: "workbench_index" */'./pages/user/components/edit_password.vue').then(r)
const newPointer = r => import(/* webpackChunkName: "workbench_index" */'./pages/map/components/new_pointer.vue').then(r)
const pointer = r => import(/* webpackChunkName: "workbench_index" */'./pages/map/components/pointer.vue').then(r)

// 定义路由映射。 其中"component" 可以是通过 Vue.extend() 创建的组件构造器，或者组件配置对象
const routes = [
    {path: '', redirect: {name: 'map'}},
    {
        path: '/admin',
        component: map,
        name: 'map',
        children: [
            // 重定向到工作台页面，而不给工作台设置path为空的别名，是为了让侧边栏能识别到当前打开了哪个子页面
        ]
    },
    {
        path: '/user',
        component: user,
        name: 'user',
    },
    {path: '/user/login', component: login, name: 'login'},
    {path: '/user/register', component: register, name: 'register'},
    {path: '/user/name', component: editName, name: 'editName'},
    {path: '/user/phone', component: editPhone, name: 'editPhone'},
    {path: '/user/password', component: editPassword, name: 'editPassword'},
    {path: '/map/newPointer', component: newPointer, name: 'newPointer'},
    {path: '/map/pointer', component: pointer, name: 'pointer'},
    // 必须放最后
    {path: '/admin/*', component: page404, meta: {}},
]

// 创建 router 实例
const router = new VueRouter({
    // 不使用hash模式，用/连接各级路径，需要在服务端进行相关配置
    mode: 'history',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return {x: 0, y: 0}
    },
})

router.beforeEach((to, from, next) => {
    console.log(`${from.fullPath} -> ${to.fullPath}`);
    if (to.path.endsWith('/') && to.path !== '/') {
        // /admin/room 和 /admin/room/ 都指向同一个页面
        next({
            path: to.path.substring(0, to.path.length - 1),
            query: to.query
        })
    }
    next();
});

export default router;
