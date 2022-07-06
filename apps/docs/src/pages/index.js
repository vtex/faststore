import React from 'react'
import Layout from '@theme/Layout'
import FastStore from '@site/src/components/FastStore/FastStore'
import UpdatesSection from '@site/src/pages/sections/UpdatesSection/UpdatesSection'
import EducationSection from '@site/src/pages/sections/EducationSection/EducationSection'

function Home() {
  return (
    <Layout title="FastStore Documentation">
      <main className="max-w-">
        <FastStore />
        <UpdatesSection />
        <EducationSection />
      </main>
    </Layout>
  )
}

export default Home
