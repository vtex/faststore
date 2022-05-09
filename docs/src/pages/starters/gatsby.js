import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'

const data = {
  name: 'Gatsby Store',
  owner: 'VTEX',
  description:
    'Kickoff your store with this boilerplate. This starter ships with the main FastStore configuration files you need to get up and running blazing fast.',
  features: [
    'Gatsby',
    'Landing page',
    'Product page',
    'Intelligent search',
    'Filters for categories',
    'Optimistic shopping cart',
    'Google Analytics',
  ],
  demoURL: 'https://gatsby.vtex.app/',
  gitHubURL: 'https://github.com/vtex-sites/gatsby.store',
  price: 'Free',
  img: '/img/starters/base-starter.png',
}

function STARTERS() {
  return (
    <Layout title="Gatsby Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
