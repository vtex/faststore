import React from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'
import SEO from '../components/HomePage/SEO'

const NotFoundPage = () => (
  <Layout>
    <SEO title="404: Not found" />
    <Container>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Container>
  </Layout>
)

export default NotFoundPage
