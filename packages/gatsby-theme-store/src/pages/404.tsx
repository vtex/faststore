import React, { FC } from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'
import SEO from '../components/HomePage/SEO'
import ErrorBoundary from '../components/Error/ErrorBoundary'
import ErrorHandler from '../components/Error/ErrorHandler'

const NotFoundPage: FC = () => (
  <ErrorBoundary fallback={(error) => <ErrorHandler error={error} />}>
    <Layout>
      <SEO title="404: Not found" />
      <Container>
        <h1>NOT FOUND</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
      </Container>
    </Layout>
  </ErrorBoundary>
)

export default NotFoundPage
