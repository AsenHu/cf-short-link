import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'Home',
            path: '/',
            component: () => import('@/pages/Home/Home.vue')
        },
        {
            name: 'Auth',
            path: '/auth',
            component: () => import('@/pages/Auth/Auth.vue')
        },
        {
            name: 'Manage',
            path: '/manage',
            component: () => import('@/pages/Manage/Manage.vue')
        }
    ]
})

export default router
