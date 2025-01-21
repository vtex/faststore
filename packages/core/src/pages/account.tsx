import { Locator } from '@vtex/client-cms'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { useEffect } from 'react'
import {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import storeConfig from '../../discovery.config'

type Props = {
  globalSections: GlobalSectionsData
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

function Page({ globalSections }: Props) {
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

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const globalSections = await getGlobalSectionsData(previewData)

  return {
    props: { globalSections },
  }
}

export default Page
