import React, { FC, useEffect } from 'react'

import RenderExtensionLoader from '../utils/render-extension-loader'

const MY_ACCOUNT_PATH = '/account'
const MY_ACCOUNT_DIV_NAME = 'my-account'
const MY_ACCOUNT_EXTENSION_NAME = 'my-account-portal'
const ONE_MIN_IN_MILLI = 60 * 100

const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE
const tenant = process.env.GATSBY_VTEX_TENANT

const MyAccount: FC = () => {
  useEffect(() => {
    const loader = new RenderExtensionLoader({
      account: tenant,
      workspace,
      path: MY_ACCOUNT_PATH,
      locale: 'pt-BR',
      verbose: true,
      publicEndpoint: undefined,
      timeout: ONE_MIN_IN_MILLI,
    })

    const myAccountDiv = document.getElementById(MY_ACCOUNT_DIV_NAME)

    if (window.__RENDER_7_RUNTIME__) {
      loader.render(MY_ACCOUNT_EXTENSION_NAME, myAccountDiv, undefined)

      return
    }

    loader
      .load()
      .then(() => {
        window.__RUNTIME__ = loader.render(
          MY_ACCOUNT_EXTENSION_NAME,
          myAccountDiv,
          undefined
        )
      })
      .catch(() => {})
  }, [])

  return <div id={MY_ACCOUNT_DIV_NAME} />
}

export default MyAccount
