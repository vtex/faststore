import React, { FC, lazy } from 'react'
import { PageProps } from 'gatsby'

import AboveTheFold from '../components/HomePage/AboveTheFold'
import BelowTheFoldPreview from '../components/HomePage/BelowTheFoldPreview'
import Layout from '../components/Layout'
import SuspenseViewport from '../components/Suspense/Viewport'
import SEO from '../components/HomePage/SEO'
import { useRC } from '../sdk/vtexrc/useRC'

const belowTheFoldPreloader = () =>
  import('../components/HomePage/BelowTheFold')

const BelowTheFold = lazy(belowTheFoldPreloader)

type Props = PageProps<unknown>

const Home: FC<Props> = (props) => {
  useRC('sendevent', 'homeView', {})

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
