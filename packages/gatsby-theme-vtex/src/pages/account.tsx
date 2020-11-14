import { localizedPath, useIntl } from '@vtex/gatsby-plugin-i18n'
import { Center, Spinner } from '@vtex/store-ui'
import { navigate } from 'gatsby'
import React, { FC, useEffect, useState } from 'react'

import Container from '../components/Container'
import ErrorBoundary from '../components/Error/ErrorBoundary'
import ErrorHandler from '../components/Error/ErrorHandler'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import RenderExtensionLoader from '../sdk/RenderExtensionLoader'
import { useProfile } from '../sdk/session/useProfile'

const MY_ACCOUNT_PATH = '/account'
const MY_ACCOUNT_DIV_NAME = 'my-account'
const MY_ACCOUNT_EXTENSION_NAME = 'my-account-portal'
const ONE_MIN_IN_MILLI = 60 * 100

const render = async (locale: string) => {
  const loader = new RenderExtensionLoader({
    account: process.env.GATSBY_VTEX_TENANT,
    workspace: process.env.GATSBY_VTEX_IO_WORKSPACE,
    verbose: process.env.NODE_ENV !== 'production',
    publicEndpoint: undefined,
    timeout: ONE_MIN_IN_MILLI,
    path: MY_ACCOUNT_PATH,
    locale,
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
}

const Loading: FC = () => (
  <Center height="750px">
    <Spinner />
  </Center>
)

const MyAccount: FC = () => {
  const profile = useProfile({ stale: false })
  const isAuthenticated = profile?.isAuthenticated?.value === 'true'
  const [loading, setLoading] = useState(true)
  const { locale, defaultLocale } = useIntl()

  useEffect(() => {
    ;(async () => {
      try {
        if (!isAuthenticated) {
          const path = localizedPath(defaultLocale, locale, '/login')

          navigate(path)

          return
        }

        await render(locale)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    })()
  }, [defaultLocale, isAuthenticated, locale])

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <div id={MY_ACCOUNT_DIV_NAME} />
      {loading && <Loading />}
    </>
  )
}

const Page: FC = () => (
  <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
    <Layout>
      <Container>
        <SuspenseSSR fallback={<Loading />}>
          <MyAccount />
        </SuspenseSSR>
      </Container>
    </Layout>
  </ErrorBoundary>
)

export default Page
