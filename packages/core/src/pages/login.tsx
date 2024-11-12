import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { useEffect } from 'react'

import { Locator } from '@vtex/client-cms'
import { GetStaticProps } from 'next'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import RenderSections from 'src/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { PageContentType, getPage } from 'src/server/cms'
import storeConfig from '../../discovery.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  EmptyState,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
}

function Page({ page: { sections }, globalSections }: Props) {
  useEffect(() => {
    const loginUrl = new URL(storeConfig.loginUrl)
    const incomingParams = new URLSearchParams(window.location.search)

    for (const [key, value] of Array.from(incomingParams)) {
      loginUrl.searchParams.append(key, value)
    }

    window.location.href = loginUrl.toString()
  }, [])

  return (
    <>
      <NextSeo noindex nofollow />
      {/*
        WARNING: Do not import or render components from any
        other folder than '../components/sections' in here.

        This is necessary to keep the integration with the CMS
        easy and consistent, enabling the change and reorder
        of elements on this page.

        If needed, wrap your component in a <Section /> component
        (not the HTML tag) before rendering it here.
      */}
      <RenderSections
        sections={sections}
        globalSections={globalSections.sections}
        components={COMPONENTS}
      />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const [page, globalSections] = await Promise.all([
    getPage<PageContentType>({
      ...(previewData?.contentType === 'login' && previewData),
      contentType: 'login',
    }),
    getGlobalSectionsData(previewData),
  ])

  return {
    props: { page, globalSections },
  }
}

export default Page
