import { PageProps } from 'gatsby'
import React, { FC, lazy } from 'react'

import ErrorBoundary from '../components/Error/ErrorBoundary'
import ErrorHandler from '../components/Error/ErrorHandler'
import AboveTheFold from '../components/HomePage/AboveTheFold'
import BelowTheFoldPreview from '../components/HomePage/BelowTheFoldPreview'
import SEO from '../components/HomePage/SEO'
import Layout from '../components/Layout'
import SuspenseViewport from '../components/Suspense/Viewport'
import { usePixelSendEvent } from '../sdk/pixel/usePixelSendEvent'

const belowTheFoldPreloader = () =>
  import('../components/HomePage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)

type Props = PageProps<unknown>

const Home: FC<Props> = (props) => {
  usePixelSendEvent(() => {
    const event = {
      pageUrl: window.location.href,
      pageTitle: document.title,
      referrer: '',
      accountName: process.env.GATSBY_STORE_ID!,
    }

    return [
      { type: 'vtex:homeView', data: event },
      { type: 'vtex:pageView', data: event },
    ]
  })

  return (
    <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
      <Layout>
        <SEO />
        <AboveTheFold {...props} />
        <SuspenseViewport
          fallback={<BelowTheFoldPreview />}
          preloader={belowTheFoldPreloader}
        >
          <BelowTheFold />
        </SuspenseViewport>
      </Layout>
    </ErrorBoundary>
  )
}

export default Home
