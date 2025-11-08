import React from 'react'
const MenuRegistration = React.lazy(() => import('./views/menu/registration/RegistrationIndex'))
const MenuList = React.lazy(() => import('./views/menu/list/ListIndex'))
const StoreRegistration = React.lazy(() => import('./views/store/registration/RegistrationIndex'))
const Setting = React.lazy(() => import('./views/setting/setting/SettingIndex'))
const OrderRegistration = React.lazy(() => import('./views/order/order/OrderIndex'))
const BillingRegistration = React.lazy(() => import('./views/billing/billing/RegistrationIndex'))
const BillingList = React.lazy(() => import('./views/billing/list/ListIndex'))
const DailyMenuPlan = React.lazy(() => import('./views/menu/daily-menu/DailyMenuIndex'))


const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/menu', name: 'Menu', exact: true },
  { path: '/menu/register', name: 'Menu Registration', element: MenuRegistration },
  { path: '/menu/list', name: 'Menu List', element: MenuList },
  { path: '/store', name: 'Store', exact: true },
  { path: '/store/raw-material', name: 'Store Registration', element: StoreRegistration },
  { path: '/setting', name: 'Setting', element: Setting },
  { path: '/order/register', name: 'Order Registration', element: OrderRegistration },
  { path: '/billing/register', name: 'Billing Registration', element: BillingRegistration },
  { path: '/billing/list', name: 'Billing List', element: BillingList },
  { path: '/menu/daily-plan', name: 'Daily Menu Plan', element: DailyMenuPlan },
]

export default routes
