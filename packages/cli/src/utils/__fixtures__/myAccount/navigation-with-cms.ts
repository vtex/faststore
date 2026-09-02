import { getMyAccountRoutes } from '@faststore/core'

export default getMyAccountRoutes({
  routes: [
    {
      route: '/pvt/account/wishlist',
      title: 'Wishlist',
      contentType: 'myAccountWishlist',
    },
    {
      route: '/pvt/account/page-static',
      title: 'Static Page',
    },
  ],
})
