import { Center, Spinner } from '@vtex/store-ui'
import React, { FC, useEffect, useState } from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'
import RenderExtensionLoader from '../sdk/renderExtensionLoader'

const MY_ACCOUNT_PATH = '/account'
const MY_ACCOUNT_DIV_NAME = 'my-account'
const MY_ACCOUNT_EXTENSION_NAME = 'my-account-portal'
const ONE_MIN_IN_MILLI = 60 * 100

const workspace = process.env.GATSBY_VTEX_IO_WORKSPACE
const tenant = process.env.GATSBY_VTEX_TENANT

const Account: FC = () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
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

        await loader.load()

        window.__RUNTIME__ = loader.render(
          MY_ACCOUNT_EXTENSION_NAME,
          myAccountDiv,
          undefined
        )
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <>
      <div id={MY_ACCOUNT_DIV_NAME} />
      {loading && (
        <Center height="500px">
          <Spinner />
        </Center>
      )}
    </>
  )
}

const Page: FC = () => (
  <Layout>
    <Container>
      <Account />
    </Container>
  </Layout>
)

export default Page
