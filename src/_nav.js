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
    to: '/pages',
    icon: 'cil-star',
    items: [
      {
        component: 'CNavItem',
        name: 'Login',
        to: '/pages/login',
      },
      {
        component: 'CNavItem',
        name: 'Register',
        to: '/pages/register',
      },
      {
        component: 'CNavItem',
        name: 'Error 404',
        to: '/pages/404',
      },
      {
        component: 'CNavItem',
        name: 'Error 500',
        to: '/pages/500',
      },
    ],
  },
]
