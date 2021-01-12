import React, { lazy } from 'react'
import type { PageProps } from 'gatsby'
import type { FC } from 'react'

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
    <Layout>
      <SEO {...props} />
      <AboveTheFold {...props} />
      <SuspenseViewport
        fallback={<BelowTheFoldPreview />}
        preloader={belowTheFoldPreloader}
      >
        <BelowTheFold {...props} />
      </SuspenseViewport>
    </Layout>
  )
}

export default Home
