import { Locator } from '@vtex/client-cms'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import type { ComponentType } from 'react'

import RenderSections from 'app/components/cms/RenderSections'
import { OverriddenDefaultEmptyState as EmptyState } from 'src/components/sections/EmptyState/OverriddenDefaultEmptyState'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { PageContentType, getPage } from 'src/server/cms'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  EmptyState,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
}

function Page({ page: { sections }, globalSections }: Props) {
  return (
    <GlobalSections {...globalSections}>
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
      <RenderSections sections={sections} components={COMPONENTS} />
    </GlobalSections>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const [page, globalSections] = await Promise.all([
    getPage<PageContentType>({
      ...(previewData?.contentType === '500' && previewData),
      contentType: '500',
    }),
    getGlobalSectionsData(previewData),
  ])

  return {
    props: { page, globalSections },
  }
}

export default Page
