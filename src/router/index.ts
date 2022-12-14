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
                path: "user",
                name: "AdminUser",
                component: () => import("^/admin/User.vue"),
            },
            {
                path: "token",
                name: "AdminToken",
                component: () => import("^/admin/Token.vue"),
            }
        ]
    },
    {
        path: "/admin/project/:project_id/api/:api_id?",
        name: "AdminApi",
        component: () => import("^/admin/Api.vue"),
    },
    {
        path: "/public",
        name: "PublicProject",
        component: () => import("^/public/Project.vue"),
    },
    {
        path: "/public/:project_id/:api_id?",
        name: "PublicApi",
        component: () => import("^/public/Api.vue"),
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/release",
        name: "Release",
        component: () => import("@/views/Release.vue"),
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router