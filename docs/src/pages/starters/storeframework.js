import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'

const data = {
  name: 'CMS Base Store',
  owner: 'VTEX',
  description:
    'This modern and clean starter integrates the Base store with VTEX Headless CMS, giving business users the autonomy to customize their stores.',
  features: [
    'VTEX Headless CMS integration',
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
  img: '/img/starters/cms-base-starter.png',
}

function STARTERS() {
  return (
    <Layout title="Base Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
