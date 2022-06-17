import React from 'react'
import Layout from '@theme/Layout'
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

function CMSStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(
    JSON.stringify(siteConfig.customFields.starters.official)
  )[1]
  return (
    <Layout
      title="CMS Base Starter"
      description="A VTEX starter made for quick integration with VTEX Headless CMS"
    >
      <StarterComponentPage data={data} />
    </Layout>
  )
}

export default CMSStarter
