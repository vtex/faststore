import React from 'react'
import Layout from '@theme/Layout'
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Head from '@docusaurus/Head'

function BeautyStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(
    JSON.stringify(siteConfig.customFields.starters.community)
  )[0]
  return (
    <Layout
      title="Beauty Store Starter"
      description="An m3 starter made for Beauty & Health ecommerce stores"
    >
      <Head>
        <meta
          property="og:image"
          content="https://vtexhelp.vtexassets.com/assets/docs/src/beautyPageThumbnail___9720ebeb724fb398256f94b9a87e8180.png"
        />
      </Head>
      <StarterComponentPage data={data} />
    </Layout>
  )
}

export default BeautyStarter
