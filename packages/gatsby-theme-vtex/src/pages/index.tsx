import React, { FC, lazy, useEffect } from 'react'
import { PageProps } from 'gatsby'

import AboveTheFold from '../components/HomePage/AboveTheFold'
import BelowTheFoldPreview from '../components/HomePage/BelowTheFoldPreview'
import Layout from '../components/Layout'
import SuspenseViewport from '../components/Suspense/Viewport'
import SuspenseSSR from '../components/Suspense/SSR'

const belowTheFoldPreloader = () =>
  import('../components/HomePage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)
const SEO = lazy(() => import('../components/HomePage/SEO'))

type Props = PageProps<unknown>

const Home: FC<Props> = (props) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <AboveTheFold {...props} />
      <SuspenseSSR fallback={null}>
        <SEO />
      </SuspenseSSR>
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold />
      </SuspenseViewport>
    </Layout>
  )
}

export default Home
