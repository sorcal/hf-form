import { createRouter, createWebHistory } from 'vue-router'
import MortgageCalculatorView from '../views/MortgageCalculatorView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MortgageCalculatorView,
    },
  ],
})

export default router
