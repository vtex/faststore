import loadable from '@loadable/component'
import { Router } from '@reach/router'
import React from 'react'

import Route from '../components/Route'

const Home = loadable(() => import('../components/Home'))
const Product = loadable(() => import('../templates/product'))

const loading = <div>Loading</div>

export default function IndexPage() {
  return (
    <Router>
      <Route path="/" render={<Home />} fallback={loading} />
      <Route path="/:slug/p" render={<Product />} fallback={loading} />
    </Router>
  )
}
