import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import type { Locator } from '@vtex/client-cms'

import RenderSections from 'src/components/cms/RenderSections'
import Hero from 'src/components/sections/Hero'
import { mark } from 'src/sdk/tests/mark'
import { getPage } from 'src/server/cms'
import type { PageContentType } from 'src/server/cms'
import CUSTOM_COMPONENTS from 'src/customizations/components'

import storeConfig from '../../../faststore.config'
import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'

/**
 * Sections: Components imported from each store's custom components and '../components/sections'.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
}

function Page({ page: { sections, settings }, globalSections }: Props) {
  return (
    <GlobalSections {...globalSections}>
      {/* SEO */}
      <NextSeo
        title={settings?.seo?.title ?? storeConfig.seo.title}
        description={settings?.seo?.description ?? storeConfig.seo?.description}
        titleTemplate={storeConfig.seo?.titleTemplate ?? storeConfig.seo?.title}
        canonical={settings?.seo?.canonical ?? storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: settings?.seo?.title ?? storeConfig.seo.title,
          description:
            settings?.seo?.description ?? storeConfig.seo.description,
        }}
      />
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q`,
            queryInput: 'search_term_string',
          },
        ]}
      />

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
> = async ({ previewData, ...context }) => {
  const [page, globalSections] = await Promise.all([
    getPage<PageContentType>({
      ...(previewData?.contentType === 'page'
        ? previewData
        : {
            filters: {
              filters: { 'settings.seo.slug': `/${context.params?.page}` },
            },
          }),
      contentType: 'page',
    }),
    getGlobalSectionsData(previewData),
  ])

  console.log(page.settings.seo)

  if (!page) {
    return {
      notFound: true,
    }
  }

  return {
    props: { page, globalSections },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

Page.displayName = 'Page'
export default mark(Page)
