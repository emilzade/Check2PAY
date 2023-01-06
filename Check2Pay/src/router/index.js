import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '../store/index'
import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DefaultLayout,
    redirect: '/main',
    children: [
      {
        path: '/main',
        name: 'Index',
        component: () => import('@/views/main/Index.vue'),
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
          sysRequired: 'false',
        },
      },
      {
        path: '/main',
        name: 'Main',
        component: {
          render() {
            return h(resolveComponent('router-view'))
          },
        },
        redirect: '/main/index',
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
          sysRequired: 'false',
        },
        children: [
          {
            path: '/main/index',
            name: 'Index',
            component: () => import('@/views/main/Index.vue'),
            meta: {
              authRequired: 'false',
              adminRequired: 'false',
              sysRequired: 'false',
            },
          },
          {
            path: '/main/history',
            name: 'History',
            component: () => import('../views/main/History.vue'),
            meta: {
              authRequired: 'false',
              adminRequired: 'false',
              sysRequired: 'false',
            },
          },
          {
            path: '/main/history/:id',
            name: 'HistoryById',
            component: () => import('../views/main/HistoryById.vue'),
            meta: {
              authRequired: 'false',
              adminRequired: 'false',
              sysRequired: 'false',
            },
          },
          // {
          //   path: '/main/parameters',
          //   name: 'Parameters',
          //   component: () => import('@/views/main/Parameters.vue'),
          // },
          // {
          //   path: '/main/settings',
          //   name: 'Settings',
          //   component: () => import('@/views/settings/Settings.vue'),
          // },
        ],
      },
      {
        path: '/unauthorized',
        name: 'Unauthorized',
        component: () => import('../views/Unauthorized.vue'),
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
          sysRequired: 'false',
        },
      },
    ],
  },

  {
    path: '/pages',
    redirect: '/pages/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    meta: {
      authRequired: 'false',
      adminRequired: 'false',
    },
    children: [
      {
        path: '/pages/404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
        },
      },
      {
        path: '/pages/500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
        },
      },
      {
        path: '/pages/login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
        },
      },
      {
        path: '/pages/register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
        meta: {
          authRequired: 'false',
          adminRequired: 'false',
        },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes: routes,
  scrollBehavior() {
    // always scroll to top
    return { top: 0 }
  },
})
/*
router.beforeEach((to, from, next) => {
  //check page is protected or not
  console.log('authRequired', to.meta.authRequired)
  console.log('adminRequired', to.meta.adminRequired)

  if (to.meta.authRequired === 'true') {
    const role = localStorage.getItem('role')
    if (role == 'user' || role == 'admin') {
      if (to.meta.adminRequired === 'true') {
        if (role == 'admin') {
          return next()
        } else {
          alert('Sorry , you need an admin permission for that...')
          router.push({
            name: 'Index',
          })
        }
      } else {
        return next()
      }
    } else {
      router.push({
        name: 'Login',
      })
    }
  } else {
    return next()
  }
})
*/

router.beforeEach(async (to, from, next) => {
  let userProfile = store.getters['auth/getUserProfile']
  let isAuthenticated = localStorage.getItem('isAuthenticated')
  if (userProfile.id === 0 && isAuthenticated) {
    await store.dispatch('auth/userProfile')
    userProfile = store.getters['auth/getUserProfile']
  }

  if (to.meta.authRequired === 'true') {
    if (userProfile.id === 0) {
      return next({ path: '/pages/login' })
    }
  }
  return next()
})
export default router
