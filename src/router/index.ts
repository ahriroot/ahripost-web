import {
    createRouter,
    createWebHistory,
    RouteRecordRaw,
} from "vue-router"
import Index from "@/views/Index.vue"
import Admin from "@/views/Admin.vue"
import Login from "@/views/Login.vue"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        name: "Index",
        component: Index,
    },
    {
        path: "/admin",
        name: "Admin",
        component: Admin,
        children: [
            {
                path: "project",
                name: "AdminProject",
                component: () => import("^/admin/Project.vue"),
            },
            {
                path: "project/:project_id/api/:api_id?",
                name: "AdminApi",
                component: () => import("^/admin/Api.vue"),
            }
        ]
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/login",
        name: "Login",
        component: () => import("@/views/Login.vue"), // 懒加载组件
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router