import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../boot/auth'
import CompletedLists from '../components/CompletedLists.vue'
import Error404 from '../views/Error404.vue'
import HomePage from '../views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/completed',
    name: 'CompletedLists',
    component: CompletedLists
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: Error404
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes

})

router.beforeEach((to, _from, next) => {
  if (to.path === '/login') {
    authService.handleLoginRedirect()
      .then(() => {
        next('/')
      })
      .catch(error => {
        console.log(error)
        next('/')
      })
  } else if (to.path === '/logout') {
    authService.handleLogoutRedirect()
      .then(() => {
        next('/')
      })
      .catch(error => {
        console.log(error)
        next('/:catchAll(.*)*')
      })
  } else {
    authService.getProfile().then(response => {
      console.log('res from router is', response)
      localStorage.setItem('user', response as string)
      authService.getAccessToken()
        .then(token => {
          localStorage.setItem('token', token as string)
        })
    })
      .catch(err => console.log('err', err))
    next()
  }
})

export default router
