import { createRouter, createWebHistory} from "vue-router";
const Generate = () => import("../views/Generate.vue");


// 添加页面路由

const routes = [
    {
        path: "/",
        name: "测试页面",
        component: Generate
    }
];

const router = createRouter({
    history: createWebHistory(""),
    routes,
});
export default router;
