import { Container } from '@vtex/store-ui'
import { GatsbySeo } from 'gatsby-plugin-next-seo'
import React from 'react'
import type { FC } from 'react'

import Layout from '../components/Layout'

const NotFoundPage: FC = () => (
  <Layout>
    <GatsbySeo
      title="404: Not found"
      description="Page not found"
      noindex
      nofollow
    />
    <Container>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Container>
  </Layout>
)

export default NotFoundPage
