import { useEffect } from 'react'
import { NextSeo } from 'next-seo'
import { EmptyState as UIEmptyState, Loader as UILoader } from '@faststore/ui'

import storeConfig from '../../faststore.config'

function Page() {
  useEffect(() => {
    window.location.href = `${storeConfig.loginUrl}${window.location.search}`
  }, [])

  return (
    <>
      <NextSeo noindex nofollow />

      <UIEmptyState title="Loading">
        <UILoader />
      </UIEmptyState>
    </>
  )
}

export default Page
