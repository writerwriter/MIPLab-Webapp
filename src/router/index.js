import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue')
    },
    {
      path: '/Main',
      name: 'Main',
      component: () => import('../views/Main.vue')
    },
    {
    path: '/PQRST',
    name: 'PQRST',
    component: () => import('../views/PQRST.vue')
    },
    {
      path: '/Hazard',
      name: 'Hazard',
      component: () => import("../views/Hazard.vue")
    },
    {
      path: '/Abnormal',
      name: 'Abnormal',
      component: () => import('../views/Abnormal.vue')
    },
    {
      path: '/Arrhythmia',
      name: 'Arrhythmia',
      component: () => import('../views/Arrhythmia.vue')
    },
    {
      path: '/PCG',
      name: 'PCG',
      component: () => import('../views/PCG.vue')
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
