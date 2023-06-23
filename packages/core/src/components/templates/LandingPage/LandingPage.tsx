import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'
import type { Locator } from '@vtex/client-cms'

import MissingContentError from 'src/sdk/error/MissingContentError/MissingContentError'
import RenderSections from 'src/components/cms/RenderSections'
import Hero from 'src/components/sections/Hero'
import Incentives from 'src/components/sections/Incentives'
import ProductShelf from 'src/components/sections/ProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import BannerText from 'src/components/sections/BannerText'
import Newsletter from 'src/components/sections/Newsletter'
import { getPage } from 'src/server/cms'
import type { PageContentType } from 'src/server/cms'
import CUSTOM_COMPONENTS from 'src/customizations/components'

import storeConfig from '../../../../faststore.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  Incentives,
  ProductShelf,
  ProductTiles,
  BannerText,
  Newsletter,
  ...CUSTOM_COMPONENTS,
}

export type LandingPageProps = {
  page: PageContentType
}

export default function LandingPage({
  page: { sections, settings },
}: LandingPageProps) {
  return (
    <>
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
    </>
  )
}

export const getLandingPageBySlug = async (
  slug: string,
  previewData: Locator
) => {
  try {
    const landingPageData = await getPage<PageContentType>({
      ...(previewData?.contentType === 'landingPage'
        ? previewData
        : {
            filters: {
              filters: { 'settings.seo.slug': `/${slug}` },
            },
          }),
      contentType: 'landingPage',
    })
    return landingPageData
  } catch (error) {
    if (error instanceof MissingContentError) {
      return null
    }

    throw error
  }
}
