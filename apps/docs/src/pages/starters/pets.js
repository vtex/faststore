import React from 'react'
import Layout from '@theme/Layout'
import StarterComponentPage from '../sections/StarterComponentPage/StarterComponentPage'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Head from '@docusaurus/Head'

function PetsStarter() {
  const { siteConfig } = useDocusaurusContext()
  const data = JSON.parse(
    JSON.stringify(siteConfig.customFields.starters.community)
  )[2]
  return (
    <Layout
      title="Pets Store Starter"
      description="A Whirpool starter made for Pet Supplies stores"
    >
      <Head>
        <meta
          property="og:image"
          content="https://vtexhelp.vtexassets.com/assets/docs/src/petsPageThumbnail___91d901c507a3a443dbae3992aa4e4c92.png"
        />
      </Head>
      <StarterComponentPage data={data} />
    </Layout>
  )
}

export default PetsStarter
