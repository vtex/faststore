import { navigate } from 'gatsby'
import React, { FC, useEffect } from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { useProfile } from '../sdk/session/useProfile'

const Iframe: FC = () => {
  const profile = useProfile({ stale: false })
  const isAuthenticated = profile?.isAuthenticated?.value === 'true'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <iframe
      title="my-account"
      id="my-account"
      frameBorder={0}
      allowFullScreen
      src="/legacy-extensions/account"
      style={{
        border: 'none',
        visibility: 'visible',
        overflow: 'hidden',
        height: 750,
        width: '100%',
      }}
    />
  )
}

const Page: FC = () => (
  <Layout>
    <Container>
      <SuspenseSSR fallback={null}>
        <Iframe />
      </SuspenseSSR>
    </Container>
  </Layout>
)

export default Page
