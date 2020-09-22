import React from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'

const Account = () => {
  return (
    <Layout>
      <Container>
        <h1>My account</h1>
        <MyAccountFetcher />
      </Container>
    </Layout>
  )
}

const MyAccountFetcher = () => {
  return (
    <iframe
      title="my-account"
      id="my-account"
      frameBorder={0}
      allowFullScreen
      src="/my-account"
      style={{
        border: 'none',
        visibility: 'visible',
        overflow: 'hidden',
        height: 750,
        width: '100%',
      }}
    />
  )
}

export default Account
