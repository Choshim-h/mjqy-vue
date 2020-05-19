import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * sidebar：专门为侧边栏导航提供，单独提出去，方便操作
 * meta.parentName： sidebar进去的子页面，保证侧边栏导航索引没变
 */

import sidebar from './sidebar'

const routes = [
  {
    path: '/',
    redirect: 'Index'
  },
  ...sidebar,
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('@/views/chart'),
    meta: { parentName: 'Index' }
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/user'),
    meta: { parentName: 'Index' }
  },
  {
    path: '/examine',
    name: 'Examine',
    component: () => import('@/views/examine'),
    meta: { parentName: 'Index' }
  },
  {
    path: '/details',
    name: 'Details',
    component: () => import('@/views/details'),
    meta: { parentName: 'Index' }
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
