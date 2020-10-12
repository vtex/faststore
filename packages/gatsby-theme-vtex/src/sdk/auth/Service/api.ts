export const tenant = process.env.GATSBY_VTEX_TENANT as string

const href = `/api/vtexid/pub`

export const api = {
  startLogin: `${href}/authentication/startlogin`,
  sendAccessKey: `${href}/authentication/accesskey/send`,
}
