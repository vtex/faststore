import { useEffect } from 'react'
import { NextSeo } from 'next-seo'

import storeConfig from '../../faststore.config'

function Page() {
  useEffect(() => {
    window.location.href = `${storeConfig.accountUrl}${window.location.search}`
  }, [])

  return (
    <>
      <NextSeo noindex nofollow />

      <div>loading...</div>
    </>
  )
}

export default Page
