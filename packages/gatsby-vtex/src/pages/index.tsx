import { Router } from '@reach/router'
import React from 'react'

import Home from '../components/Home'
import Product from '../templates/product'

export default function IndexPage() {
  return (
    <Router>
      <Home path="/" />
      <Product path="/:slug/p" />
    </Router>
  )
}
