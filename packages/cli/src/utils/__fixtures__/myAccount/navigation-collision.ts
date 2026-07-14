import { getMyAccountRoutes } from '@faststore/core'

export default getMyAccountRoutes({
  routes: [
    {
      route: '/pvt/account/profile',
      title: 'Profile Override',
      contentType: 'myAccountProfileCustom',
    },
    {
      route: '/shop/not-account',
      title: 'Outside',
      contentType: 'myAccountOutside',
    },
  ],
})
