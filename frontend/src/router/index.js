import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },

  {
  path: '/princip',
  name: 'Princip',
  component: () => import('../views/Princip.vue')
  },

  {
  path: '/profil',
  name: 'profil',
  component: () => import('../views/Profil.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
