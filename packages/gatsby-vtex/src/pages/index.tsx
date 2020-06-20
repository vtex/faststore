import React, { StrictMode } from 'react'
import { Router } from '@reach/router'

import Home from '../components/Home'
import Product from '../templates/product'

export default function IndexPage() {
  return (
    <StrictMode>
      <Router>
        <Home path="/" />
        <Product path="/:slug/p" />
      </Router>
    </StrictMode>
  )
}
