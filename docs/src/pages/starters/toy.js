import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

function STARTERS() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(JSON.stringify(siteConfig.customFields.starters.community))[1]
    return (
    <Layout title="Toy Store Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
