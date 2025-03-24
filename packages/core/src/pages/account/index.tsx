import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { useEffect } from 'react'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import storeConfig from 'discovery.config'
import {
  getServerSideProps,
  type MyAccountProps,
} from 'src/experimental/myAccountSeverSideProps'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

function Page({ globalSections }: MyAccountProps) {
  useEffect(() => {
    window.location.href = `${storeConfig.accountUrl}${window.location.search}`
  }, [])

  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <div>loading...</div>
    </RenderSections>
  )
}

export { getServerSideProps }

export default Page
