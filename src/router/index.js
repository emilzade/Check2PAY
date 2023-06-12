import { h, resolveComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
//import store from '../store/index'
import DefaultLayout from '@/layouts/DefaultLayout'
import VueCookies from 'vue-cookies'

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
          authRequired: false,
          adminRequired: false,
          sysRequired: false,
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
          authRequired: false,
          adminRequired: false,
          sysRequired: false,
        },
        children: [
          {
            path: '/main/index',
            name: 'Index',
            component: () => import('@/views/main/Index.vue'),
            meta: {
              authRequired: false,
              adminRequired: false,
              sysRequired: false,
            },
          },
          {
            path: '/main/history',
            name: 'History',
            component: () => import('../views/main/History.vue'),
            meta: {
              authRequired: false,
              adminRequired: false,
              sysRequired: false,
            },
          },
          {
            path: '/main/history/:id',
            name: 'HistoryById',
            component: () => import('../views/main/HistoryById.vue'),
            meta: {
              authRequired: false,
              adminRequired: false,
              sysRequired: false,
            },
          },
          {
            path: '/main/partition',
            name: 'Partition',
            component: () => import('../views/main/Partition.vue'),
            meta: {
              authRequired: false,
              adminRequired: false,
              sysRequired: false,
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
          authRequired: false,
          adminRequired: false,
          sysRequired: false,
        },
      },
    ],
  },

  {
    path: '/pages',
    redirect: '/404',
    name: 'Pages',
    component: {
      render() {
        return h(resolveComponent('router-view'))
      },
    },
    meta: {
      authRequired: false,
      adminRequired: false,
    },
    children: [
      {
        path: '/404',
        name: 'Page404',
        component: () => import('@/views/pages/Page404'),
        meta: {
          authRequired: false,
          adminRequired: false,
        },
      },
      {
        path: '/500',
        name: 'Page500',
        component: () => import('@/views/pages/Page500'),
        meta: {
          authRequired: false,
          adminRequired: false,
        },
      },
      {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/pages/Login'),
        meta: {
          authRequired: false,
          adminRequired: false,
        },
      },
      {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/pages/Register'),
        meta: {
          authRequired: false,
          adminRequired: false,
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

  if (to.meta.authRequired === true) {
    const role = localStorage.getItem('role')
    if (role == 'user' || role == 'admin') {
      if (to.meta.adminRequired === true) {
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
  const isAuthenticated = localStorage.getItem('isAuthenticated')
  const token = VueCookies.get('token')
  //const user = localStorage.getItem('user')
  // var role = ''
  // if (user != null) {
  //   if (user.length > 0) {
  //     role = JSON.parse(user).roleName
  //   }
  // }

  if (to.meta.authRequired === true) {
    if (isAuthenticated && token != '') {
      return next()
    } else {
      return next({ path: '/login' })
    }
  } else {
    return next()
  }
})
export default router
