import React from 'react'

import Container from '../components/Container'
import SEO from '../components/SEO/siteMetadata'

const NotFoundPage = () => (
  <>
    <SEO title="404: Not found" />
    <Container>
      <h1>NOT FOUND</h1>
      <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
    </Container>
  </>
)

export default NotFoundPage
