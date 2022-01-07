import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'

const data = {
  name: 'Storeframework Store',
  owner: 'VTEX',
  description:
    'This starter integrates Base.Store with VTEX CMS as a first class citizen to empower the business user tweaking the store',
  features: [
    'VTEX CMS integration',
    'Landing page',
    'Product page',
    'Intelligent search',
    'Filters for categories',
    'Optimistic shopping cart',
    'Google Analytics',
  ],
  demoURL: 'https://storeframework.vtex.app/',
  gitHubURL: 'https://github.com/vtex-sites/storeframework.store',
  price: 'Free',
  img: '/img/base-starter.png',
}

function STARTERS() {
  return (
    <Layout title="Base Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
