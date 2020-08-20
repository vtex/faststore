import React, { useEffect } from 'react'
import { HashRouter, Switch } from 'react-router-dom'

import Container from '../components/Container'
import Layout from '../components/Layout'
import SEO from '../components/SEO/siteMetadata/lazy'
import RenderExtensionLoader from '../utils/render-extension-loader'

const Account = () => {
  useEffect(() => {
    const loader = new RenderExtensionLoader({
      account: 'storecomponents',
      workspace: 'icaromyaccount',
      path: '/account',
      locale: 'pt-BR',
      verbose: true,
      publicEndpoint: undefined,
      timeout: 1500000,
    })

    loader
      .load()
      .then(() => {
        window.__RUNTIME__ = loader.render(
          'my-account-portal',
          document.getElementById('my-account'),
          undefined
        )
      })
      .catch(() => {})
  }, [])

  return (
    <Layout>
      <SEO title="My account" />
      <Container>
        <h1>My account</h1>

        <HashRouter>
          <Switch>
            <>
              <div id="my-account" />
            </>
          </Switch>
        </HashRouter>
      </Container>
    </Layout>
  )
}

export default Account
