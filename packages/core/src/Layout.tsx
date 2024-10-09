import { useEffect, type PropsWithChildren } from 'react'

import { useRouter } from 'next/router'

function Layout({ children }: PropsWithChildren) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = () => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: 'pageview',
        pageTitle: document.title,
      })
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return <>{children}</>
}

export default Layout
