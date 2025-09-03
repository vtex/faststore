import type { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from '../components/cms/GlobalSections'

import { default as GLOBAL_COMPONENTS } from '../components/cms/global/Components'
import RenderSections from '../components/cms/RenderSections'
import { getComponentKey } from '../utils/cms'
import { OverriddenDefaultEmptyState as EmptyState } from '../components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from '../customizations/src/components'
import PLUGINS_COMPONENTS from '../plugins'
import PageProvider from '../sdk/overrides/PageProvider'
import type { PageContentType } from '../server/cms'
import { injectGlobalSections } from '../server/cms/global'
import { contentService } from '../server/content/service'
import type { PreviewData } from '../server/content/types'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  [getComponentKey(EmptyState, 'EmptyState')]: EmptyState,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
}

function Page({
  page: { sections },
  globalSections: globalSectionsProp,
}: Props) {
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}

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
        contentType: '500',
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
