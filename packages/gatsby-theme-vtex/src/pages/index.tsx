import { PageProps } from 'gatsby'
import React, { FC, useEffect } from 'react'

import AboveTheFold from '../components/HomePage/AboveTheFold'
import BelowTheFold from '../components/HomePage/BelowTheFold'
import SEO from '../components/HomePage/SEO'
import Layout from '../components/Layout'

type Props = PageProps<unknown>

const Home: FC<Props> = (props) => {
  useEffect(() => {
    ;(window as any).vtexrca('sendevent', 'homeView', {})
  }, [])

  return (
    <Layout>
      <AboveTheFold {...props} />
      <SEO />
      <BelowTheFold />
    </Layout>
  )
}

export default Home
