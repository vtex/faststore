import { getMyAccountRoutes } from 'src/sdk/account/getMyAccountRoutes'

export default getMyAccountRoutes({
  routes: [
    {
      route: '/pvt/account/legacy',
      title: 'Legacy',
    },
  ],
})
