import RenderExtensionLoader from '../../sdk/legacy-extensions/render-extension-loader'
import { isServer } from '../../utils/env'

export const MY_ACCOUNT_ROOT = 'my-account-root'
const MY_ACCOUNT_PATH = '/account'
const ONE_MIN_IN_MILLI = 60 * 100

const tenant = process.env.GATSBY_VTEX_TENANT
const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE

if (!isServer) {
  const loader = new RenderExtensionLoader({
    account: tenant,
    workspace,
    path: MY_ACCOUNT_PATH,
    locale: 'pt-BR',
    verbose: true,
    publicEndpoint: undefined,
    timeout: ONE_MIN_IN_MILLI,
  })

  const root = document.getElementById(MY_ACCOUNT_ROOT)

  loader.load().then(() => {
    window.__RUNTIME__ = loader.render('my-account-portal', root, undefined)
  })
}

export default () => null
