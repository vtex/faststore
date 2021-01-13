import React from 'react'
import type { FC } from 'react'

import Container from '../components/Container'
import SiteMetadata from '../components/SEO/SiteMetadata'
import Layout from '../components/Layout'

const NotFoundPage: FC = () => (
  <Layout>
    <SiteMetadata title="404: Not found" />
    <Container>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Container>
  </Layout>
)

export default NotFoundPage
