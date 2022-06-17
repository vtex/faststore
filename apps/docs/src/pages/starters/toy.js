import React from 'react'
import Layout from '@theme/Layout'
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Head from '@docusaurus/Head'

function ToyStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(
    JSON.stringify(siteConfig.customFields.starters.community)
  )[1]
  return (
    <Layout
      title="Toy Store Starter"
      description="An FRN starter made for Toys & Hobbies ecommerce stores"
    >
      <Head>
        <meta
          property="og:image"
          content="https://vtexhelp.vtexassets.com/assets/docs/src/toyPageThumbnail___9ea01ab2fadfe3cd03e5ff1b9a252f06.png"
        />
      </Head>
      <StarterComponentPage data={data} />
    </Layout>
  )
}

export default ToyStarter
