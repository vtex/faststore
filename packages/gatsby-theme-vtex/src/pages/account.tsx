import React, { FC, useEffect } from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'
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

const Page: FC = () => (
  <Layout>
    <Container>
      <h1>My account</h1>
      {/* <iframe
        title="my-account"
        id="my-account"
        frameBorder={0}
        allowFullScreen
        src="/my-account"
        style={{
          border: 'none',
          visibility: 'visible',
          overflow: 'hidden',
          height: 750,
          width: '100%',
        }}
      /> */}
      <MyAccount />
    </Container>
  </Layout>
)

export default Page
