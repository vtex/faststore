import { Box, Center, Flex, Spinner } from '@vtex/store-ui'
import { PageProps } from 'gatsby'
import React, { FC, useEffect, useState } from 'react'

import { AUTH_PROVIDERS } from '../components/Auth/Providers'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { onLoginSuccessful } from '../sdk/auth/utils'
import { useEnsuredSession } from '../sdk/session/useEnsuredSession'

type Props = PageProps<unknown>

const Page: FC = () => {
  const [index, setIndex] = useState(0)
  const { Component } = AUTH_PROVIDERS[index]
  const { value } = useEnsuredSession()
  const storeUserID = value?.namespaces.authentication?.storeUserID

  useEffect(() => {
    if (storeUserID) {
      onLoginSuccessful('/account')
    }
  }, [storeUserID])

  if (storeUserID) {
    return (
      <Flex variant="login.page.container">
        <Box>Logged in as {storeUserID}</Box>
      </Flex>
    )
  }

  return (
    <Flex variant="login.page.container">
      <Box variant="login.page.group">
        <Box variant="login.page.group.title">Choose a sign in option</Box>

        {AUTH_PROVIDERS.map(({ Button }, i) =>
          i !== index ? (
            <Button key={i} variant="login.page" onClick={() => setIndex(i)} />
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
