export const SellersQueryResult = `query SellersQuery {
    sellers(
      postalCode: "32808"
      country: "USA"
    ) {
        id
        sellers {
          id
          name
        }
      }
    }`

export const regionFetch = {
  path: '/api/checkout/pub/regions/?country=USA&sc=&postalCode=32808',
  init: {
    headers: { 'content-type': 'application/json', 'X-FORWARDED-HOST': '' },
  },
  options: {
    account: 'storeframework',
    environment: 'vtexcommercestable',
    storeCookies: expect.any(Function),
    vtexApi: 'checkout',
  },
  result: [
    {
      id: 'v2.4325C29BA00E6470CBA54999680076F9',
      sellers: [
        {
          id: 'storeframework01',
          name: 'storeframework01',
          logo: '',
        },
        {
          id: 'storeframework02',
          name: 'storeframework02',
          logo: '',
        },
      ],
    },
  ],
}
