import React, { FC } from 'react'

import Container from '../components/Container'
import Layout from '../components/Layout'

const Page: FC = () => (
  <Layout>
    <Container>
      <h1>My account</h1>
      <iframe
        title="my-account"
        id="my-account"
        frameBorder={0}
        allowFullScreen
        src="/legacy-extensions/account"
        style={{
          border: 'none',
          visibility: 'visible',
          overflow: 'hidden',
          height: 750,
          width: '100%',
        }}
      />
    </Container>
  </Layout>
)

export default Page
