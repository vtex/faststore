import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { useEffect } from 'react'

import type { GetStaticProps } from 'next'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import RenderSections from 'src/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import PLUGINS_COMPONENTS from 'src/plugins'
import PageProvider from 'src/sdk/overrides/PageProvider'
import type { PageContentType } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import storeConfig from '../../discovery.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  EmptyState,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
}

function Page({
  page: { sections },
  globalSections: { sections: globalSections, settings: globalSettings },
}: Props) {
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
      <PageProvider context={{ globalSettings }}>
        <RenderSections
          sections={sections}
          globalSections={globalSections}
          components={COMPONENTS}
        />
      </PageProvider>
    </>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  PreviewData
> = async ({ previewData }) => {
  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const [page, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      contentService.getSingleContent<PageContentType>({
        contentType: 'login',
        previewData,
      }),
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: { page, globalSections: globalSectionsResult },
  }
}

export default Page
