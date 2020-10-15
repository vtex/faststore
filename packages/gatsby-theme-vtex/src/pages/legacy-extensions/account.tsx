import React, { FC, useEffect } from 'react'

import RenderExtensionLoader from '../../sdk/legacy-extensions/render-extension-loader'

const MY_ACCOUNT_ROOT = 'my-account-root'
const MY_ACCOUNT_PATH = '/account'
const ONE_MIN_IN_MILLI = 60 * 100

const tenant = process.env.GATSBY_VTEX_TENANT
const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE

let once = true

const Page: FC = () => {
  useEffect(() => {
    if (!once) {
      return
    }

    once = false

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
  }, [])

  return <div id={MY_ACCOUNT_ROOT} />
}

export default Page
