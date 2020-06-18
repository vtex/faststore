import React from 'react'
import { Router } from '@reach/router'

import Home from '../components/home'
import Product from '../templates/product'

export default function IndexPage() {
  return (
    <Router>
      <Home path="/" />
      <Product path="/:slug/p" />
    </Router>
  )
}
