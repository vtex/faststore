import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'
import type { GetStaticProps } from 'next'
import type { Locator } from '@vtex/client-cms'

import RenderPageSections from 'src/components/cms/RenderPageSections'
import BannerText from 'src/components/sections/BannerText'
import Hero from 'src/components/sections/Hero'
import IncentivesHeader from 'src/components/sections/Incentives/IncentivesHeader'
import Newsletter from 'src/components/sections/Newsletter'
import ProductShelf from 'src/components/sections/ProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import { mark } from 'src/sdk/tests/mark'
import { getPage } from 'src/server/cms'
import type { PageContentType } from 'src/server/cms'
import CUSTOM_SECTIONS from 'src/customizations'

import storeConfig from '../../store.config'

/**
 * Sections: Components imported from each store's custom components and '../components/sections'.
 * Do not import or render components from any other folder in here.
 */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  BannerText,
  IncentivesHeader,
  ProductShelf,
  ProductTiles,
  Newsletter,
  ...CUSTOM_SECTIONS,
}

type Props = PageContentType

function Page({ sections, settings }: Props) {
  return (
    <>
      {/* SEO */}
      <NextSeo
        title={settings.seo.title}
        description={settings.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={settings.seo.canonical ?? storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: settings.seo.title,
          description: settings.seo.description,
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
      <RenderPageSections sections={sections} components={COMPONENTS} />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  const page = await getPage<PageContentType>({
    ...(context.previewData?.contentType === 'page'
      ? context.previewData
      : { filters: { 'settings.seo.slug': '/' } }),
    contentType: 'page',
  })

  return {
    props: page,
  }
}

Page.displayName = 'Page'
export default mark(Page)
