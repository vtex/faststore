import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

function STARTERS() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(JSON.stringify(siteConfig.customFields.starters.official))[0]
    return (
    <Layout title="Base Starter">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default STARTERS;
