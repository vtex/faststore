import React from 'react';
import Layout from '@theme/Layout';
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

function BaseStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(JSON.stringify(siteConfig.customFields.starters.official))[0]
    return (
    <Layout title="Base Starter" description="A VTEX starter made for quick setup of standard B2C stores">
      <StarterComponentPage data={data} />
    </Layout>
  );
}

export default BaseStarter;
