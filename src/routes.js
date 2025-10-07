import React from 'react'
const MenuRegistration = React.lazy(() => import('./views/menu/registration/RegistrationIndex'))
const MenuList = React.lazy(() => import('./views/menu/list/ListIndex'))
const StoreRegistration = React.lazy(() => import('./views/store/registration/RegistrationIndex'))
const Setting = React.lazy(() => import('./views/setting/setting/SettingIndex'))
const OrderRegistration = React.lazy(() => import('./views/order/order/OrderIndex'))

const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/menu', name: 'Menu', exact: true },
  { path: '/menu/register', name: 'Menu Registration', element: MenuRegistration },
  { path: '/menu/list', name: 'Menu List', element: MenuList },
  { path: '/store', name: 'Store', exact: true },
  { path: '/store/raw-material', name: 'Store Registration', element: StoreRegistration },
  { path: '/setting', name: 'Setting', element: Setting },
  { path: '/order/register', name: 'Order Registration', element: OrderRegistration },
]

export default routes
