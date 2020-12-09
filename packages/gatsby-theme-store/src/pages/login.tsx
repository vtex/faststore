import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Center, Flex, Spinner } from '@vtex/store-ui'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import { AUTH_PROVIDERS } from '../components/Auth/Providers'
import ErrorBoundary from '../components/Error/ErrorBoundary'
import ErrorHandler from '../components/Error/ErrorHandler'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { useOnLoginSuccessful } from '../sdk/auth/useOnLoginSuccessful'
import { useProfile } from '../sdk/session/useProfile'

type Props = PageProps<unknown>

const Page: FC = () => {
  const onLoginSuccessful = useOnLoginSuccessful()
  const { formatMessage } = useIntl()
  const [index, setIndex] = useState(0)
  const { Component } = AUTH_PROVIDERS[index]
  const profile = useProfile({ stale: false })
  const isAuthenticated = profile?.isAuthenticated?.value === 'true'

  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccessful('/account')
    }
  }, [isAuthenticated, onLoginSuccessful])

  if (isAuthenticated) {
    return (
      <Center height="200px">
        <Spinner />
      </Center>
    )
  }

  return (
    <Flex variant="login.page.container">
      <Box variant="login.page.group">
        <Box variant="login.page.group.title">
          {formatMessage({
            id: 'login.page.title',
          })}
        </Box>

        {AUTH_PROVIDERS.map(({ Button: ButtonComponent }, i) =>
          i !== index ? (
            <ButtonComponent
              key={i}
              variant="login.page"
              onClick={() => setIndex(i)}
            />
          ) : null
        )}
      </Box>

      <Box variant="login.page.group">
        <SuspenseSSR
          fallback={
            <Center height="200px">
              <Spinner />
            </Center>
          }
        >
          <Component variant="page" />
        </SuspenseSSR>
      </Box>
    </Flex>
  )
}

// We split into two components to avoid re-rendering the <Layout/> when
// selecting Auth method
const PageWithLayout: FC<Props> = () => (
  <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
    <Layout>
      <SuspenseSSR
        fallback={
          <Center height="300px">
            <Spinner />
          </Center>
        }
      >
        <Page />
      </SuspenseSSR>
    </Layout>
  </ErrorBoundary>
)

export default PageWithLayout
