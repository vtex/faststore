import React from 'react'
import Layout from '@theme/Layout'
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Head from '@docusaurus/Head'

function BaseStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(
    JSON.stringify(siteConfig.customFields.starters.official)
  )[0]
  return (
    <Layout
      title="Base Starter"
      description="A VTEX starter made for quick setup of standard B2C stores"
    >
      <Head>
        <meta
          property="og:image"
          content="https://vtexhelp.vtexassets.com/assets/docs/src/basePageThumbnail___f4a77f508aac5d3d06c25c5cf8f824dd.png"
        />
      </Head>
      <StarterComponentPage data={data} />
    </Layout>
  )
}

export default BaseStarter
