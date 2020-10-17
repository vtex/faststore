import { navigate } from 'gatsby'
import React, { FC, useEffect, useRef } from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'
import SuspenseSSR from '../components/Suspense/SSR'
import { useSession } from '../sdk/session/useSession'

const Iframe: FC = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [session, dispatch] = useSession({ stale: false })
  const isAuthenticated =
    session?.namespaces.profile?.isAuthenticated?.value === 'true'

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
      ref={iframeRef}
      title="my-account"
      id="my-account"
      frameBorder={0}
      allowFullScreen
      src="/legacy-extensions/account"
      onLoad={() => {
        const pathname = iframeRef.current?.contentWindow?.location.pathname

        if (pathname === '/legacy-extensions/account') {
          return
        }

        // eslint-disable-next-line no-console
        console.log({ pathname })
        navigate('/')
        dispatch({ type: 'clear' })
      }}
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
