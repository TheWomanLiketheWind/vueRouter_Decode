import Vue from 'vue'
// 此处为 手写Router
import VueRouter from './VueRouter'
Vue.use(VueRouter)

import Hello from '../pages/Hello'
import time from '../pages/time'
import date from '../pages/date'
import Index from '../pages/index'

const routes = [
  { path: '/', component: Index },
  { path: '/Hello', component: Hello },
  { path: '/time', component: time },
  { path: '/date', component: date },
]

const router = new VueRouter({
  mode: 'hash', // hash模式
  routes // short for `routes: routes`
})

export default router