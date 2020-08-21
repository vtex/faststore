import React, { useEffect } from 'react'

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
      id="my-account"
      frameBorder={0}
      allowFullScreen
      width={1000}
      height={1000}
      src="/my-account"
      style={{ border: 'none', visibility: 'visible' }}
    />
  )
}
export default Account
