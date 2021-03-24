import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { Box, Center, Flex, Spinner } from '@vtex/store-ui'
import React, { useEffect, useState } from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import { AUTH_PROVIDERS } from '../components/Auth/Providers'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { useOnLoginSuccessful } from '../sdk/auth/useOnLoginSuccessful'
import { useProfile } from '../sdk/session/useProfile'
import Helmet from '../components/SEO/Helmet'
import { useProviders } from '../sdk/auth/useProviders'
import type { ProvidersResponse } from '../sdk/auth/Service/getProviders'

type Props = PageProps<unknown>
type DefaultProvidersComponents = typeof AUTH_PROVIDERS
type ProviderName = keyof typeof AUTH_PROVIDERS

const filterProviders = (
  providersComponents: DefaultProvidersComponents,
  storeProviders?: ProvidersResponse
) => {
  if (!storeProviders) {
    return [{ name: '', ...providersComponents.NoState }]
  }

  const hasLogin = storeProviders.passwordAuthentication
  const hasAccessCode = storeProviders.accessKeyAuthentication
  const hasSingleProvider = storeProviders.oAuthProviders.length === 1

  if (!hasLogin && !hasAccessCode && hasSingleProvider) {
    return [
      {
        name: storeProviders.oAuthProviders[0].providerName,
        ...providersComponents.CustomProvider,
      },
    ]
  }

  const providers = []

  if (hasLogin) {
    providers.push({
      name: 'EmailAndPassword',
      ...providersComponents.EmailAndPassword,
    })
  }

  if (hasAccessCode) {
    providers.push({
      name: 'EmailVerification',
      ...providersComponents.EmailVerification,
    })
  }

  storeProviders.oAuthProviders.forEach(({ providerName }) => {
    const provider = providersComponents[providerName as ProviderName]

    if (provider) {
      providers.push({ name: providerName, ...provider })
    }
  })

  return providers
}

const Page: FC = () => {
  const onLoginSuccessful = useOnLoginSuccessful()
  const { formatMessage } = useIntl()
  const { data: storeProviders } = useProviders()
  const profile = useProfile({ stale: false })

  const filteredProviders = filterProviders(AUTH_PROVIDERS, storeProviders)

  const [focusProvider, setFocusProvider] = useState(0)

  const { Component } = filteredProviders[focusProvider]

  const isAuthenticated = profile?.isAuthenticated?.value === 'true'

  const hasMultipleProviders = filteredProviders.length > 1

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
        {hasMultipleProviders && (
          <Box variant="login.page.group.title">
            {formatMessage({
              id: 'login.page.title',
            })}
          </Box>
        )}
        {filteredProviders.map(({ Button: ButtonComponent }, i) =>
          i !== focusProvider ? (
            <ButtonComponent
              key={i}
              variant="login.page"
              onClick={() => setFocusProvider(i)}
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
          <Component
            variant="page"
            providerName={filteredProviders[focusProvider].name}
          />
        </SuspenseSSR>
      </Box>
    </Flex>
  )
}

// We split into two components to avoid re-rendering the <Layout/> when
// selecting Auth method
const PageWithLayout: FC<Props> = () => (
  <>
    <Helmet
      meta={[
        {
          name: 'robots',
          content: 'noindex, nofollow',
        },
      ]}
    />

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
  </>
)

export default PageWithLayout
