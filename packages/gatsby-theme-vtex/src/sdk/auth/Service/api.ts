export const tenant = process.env.GATSBY_VTEX_TENANT as string

const href = `https://${tenant}.vtexcommercestable.com.br/api/vtexid/pub`

export const api = {
  startLogin: `${href}/authentication/startlogin`,
  sendAccessKey: `${href}/authentication/accesskey/send`,
}
