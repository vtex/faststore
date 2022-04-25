import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'

const data = {
  name: 'NextJS Store',
  owner: 'VTEX',
  description:
    'Kickoff your store with this boilerplate. This starter ships with the main FastStore configuration files you need to get up and running blazing fast.',
  features: [
    'NextJS',
    'Landing page',
    'Product page',
    'Intelligent search',
    'Filters for categories',
    'Optimistic shopping cart',
    'Google Analytics',
  ],
  demoURL: 'https://nextjs.vtex.app/',
  gitHubURL: 'https://github.com/vtex-sites/nextjs.store',
  price: 'Free',
  img: '/img/starters/base-starter.png',
}

function STARTERS() {
  return (
    <Layout title="NextJS Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
