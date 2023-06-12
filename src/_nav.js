export default [
  {
    component: 'CNavItem',
    name: 'Index',
    to: '/main/index',
    icon: 'cil-home',
  },
  {
    component: 'CNavItem',
    name: 'History',
    to: '/main/history',
    icon: 'cil-calendar',
  },
  {
    component: 'CNavItem',
    name: 'Partition',
    to: '/main/partition',
    icon: 'cil-applications',
  },
  // {
  //   component: 'CNavGroup',
  //   name: 'Main',
  //   to: '/main',
  //   icon: 'cil-puzzle',
  //   items: [
  //     {
  //       component: 'CNavItem',
  //       name: 'Parameters',
  //       to: '/main/parameters',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'History',
  //       to: '/main/history',
  //     },
  //     {
  //       component: 'CNavItem',
  //       name: 'Settings',
  //       to: '/main/settings',
  //     },
  //   ],
  // },

  {
    component: 'CNavGroup',
    name: 'Pages',
    to: '/',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/500',
      },
    ],
  },
]
