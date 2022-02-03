import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'

const data = {
  name: 'Base Store',
  owner: 'VTEX',
  description:
    'Kickoff your store with this boilerplate. This starter ships with the main FastStore configuration files you need to get up and running blazing fast.',
  features: [
    'Landing page',
    'Product page',
    'Intelligent search',
    'Filters for categories',
    'Optimistic shopping cart',
    'Google Analytics',
  ],
  demoURL: 'https://base.vtex.app/',
  gitHubURL: 'https://github.com/vtex-sites/base.store',
  price: 'Free',
  img: '/img/starters/base-starter.png',
}

function STARTERS() {
  return (
    <Layout title="Base Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
