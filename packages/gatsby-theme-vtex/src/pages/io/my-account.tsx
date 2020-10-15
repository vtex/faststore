import { Center, Spinner } from '@vtex/store-ui'
import React, { FC, useEffect, useState } from 'react'

import RenderExtensionLoader from '../../sdk/legacy-extensions/render-extension-loader'

const MY_ACCOUNT_ROOT = 'my-account-root'
const MY_ACCOUNT_PATH = '/account'
const ONE_MIN_IN_MILLI = 60 * 100

const tenant = process.env.GATSBY_VTEX_TENANT
const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE

let once = true

const render = async () => {
  const loader = new RenderExtensionLoader({
    account: tenant,
    workspace,
    path: MY_ACCOUNT_PATH,
    locale: 'pt-BR',
    verbose: true,
    publicEndpoint: undefined,
    timeout: ONE_MIN_IN_MILLI,
  })

  await loader.load()

  const root = document.getElementById(MY_ACCOUNT_ROOT)

  window.__RUNTIME__ = loader.render('my-account-portal', root, undefined)
}

const Page: FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!once) {
      return
    }

    once = false

    render().then(() => setLoading(false))
  }, [])

  return (
    <>
      <div id={MY_ACCOUNT_ROOT} />
      {loading && (
        <Center height="500px">
          <Spinner />
        </Center>
      )}
    </>
  )
}

export default Page
