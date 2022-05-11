import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

function BeautyStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(JSON.stringify(siteConfig.customFields.starters.community))[0]
    return (
    <Layout title="Beauty Store Starter" description="A m3 starter made for Beauty & Health ecommerce stores">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default BeautyStarter;
