import React, { FC, lazy } from 'react'
import { PageProps } from 'gatsby'

import BelowTheFoldPreview from '../components/HomePage/BelowTheFoldPreview'
import SuspenseViewport from '../components/Suspense/Viewport'
import AboveTheFold from '../components/HomePage/AboveTheFold'
import Layout from '../components/Layout'
import SEO from '../components/HomePage/SEO'
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
      accountName: process.env.GATSBY_VTEX_TENANT!,
    }

    return [
      { type: 'vtex:homeView', data: event },
      { type: 'vtex:pageView', data: event },
    ]
  })

  return (
    <Layout>
      <AboveTheFold {...props} />
      <SEO />
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
