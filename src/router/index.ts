import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/DashBoard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/weather',
      name: 'weather',
      props: true,
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/WeatherDetails.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileDashboard.vue'),
    },
  ],
})

router.beforeResolve((to, from, next) => {
  if (to.name) {
    // @ts-ignore
    NProgress.start()
  }
  next()
})

// @ts-ignore
router.afterEach((to, from) => {
  // @ts-ignore
  NProgress.done()
})

export default router
