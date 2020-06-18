import React from 'react'
import { Router } from '@reach/router'

import Home from '../components/home'
import Product from '../components/product'

export default function IndexPage() {
  return (
    <Router>
      <Home path="/" />
      <Product path="/:productSlug/p" />
    </Router>
  )
}
