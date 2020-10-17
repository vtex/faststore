import { Box, Button, Center, Flex, Spinner } from '@vtex/store-ui'
import { PageProps } from 'gatsby'
import React, { FC, useEffect, useState } from 'react'

import { AUTH_PROVIDERS } from '../components/Auth/Providers'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { onLoginSuccessful } from '../sdk/auth/utils'
import { useProfile } from '../sdk/session/useProfile'
import { useSession } from '../sdk/session/useSession'

type Props = PageProps<unknown>

const Page: FC = () => {
  const [index, setIndex] = useState(0)
  const { Component } = AUTH_PROVIDERS[index]
  const profile = useProfile({ stale: false })
  const name = profile?.firstName ?? profile?.email
  const isAuthenticated = profile?.isAuthenticated.value === 'true'

  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccessful('/account')
    }
  }, [isAuthenticated])

  if (isAuthenticated) {
    return (
      <Flex variant="login.page.container">
        <Box>Logged in as {name}</Box>
        <Button>Logout</Button>
      </Flex>
    )
  }

  return (
    <Flex variant="login.page.container">
      <Box variant="login.page.group">
        <Box variant="login.page.group.title">Choose a sign in option</Box>

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
)

export default PageWithLayout
