import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Main',
    component: () => import('../views/Main.vue'),
    meta: {title: 'CardioTool'},
    },
    {
      path: '/Main',
      name: 'Main',
      component: () => import('../views/Main.vue'),
      meta: {title: 'CardioTool'},
    },
    {
    path: '/PQRST',
    name: 'PQRST',
    component: () => import('../views/PQRST.vue'),
    meta: {title: 'PQRST'},
    },
    {
      path: '/Hazard',
      name: 'Hazard',
      component: () => import("../views/Hazard.vue"),
      meta: {title: 'Hazard'},
    },
    {
      path: '/Abnormal',
      name: 'Abnormal',
      component: () => import('../views/Abnormal.vue'),
      meta: {title: 'Abnormal'},
    },
    {
      path: '/Arrhythmia',
      name: 'Arrhythmia',
      component: () => import('../views/Arrhythmia.vue'),
      meta: {title: 'Arrhythmia'},
    },
    {
      path: '/PCG',
      name: 'PCG',
      component: () => import('../views/PCG.vue'),
      meta: {title: 'PCG'},
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title;
  next();
})

export default router
