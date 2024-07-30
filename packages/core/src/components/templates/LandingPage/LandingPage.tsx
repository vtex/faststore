import type { Locator } from '@vtex/client-cms'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

import RenderSections from 'app/components/cms/RenderSections'
import BannerNewsletter from 'app/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'app/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultHero as Hero } from 'app/components/sections/Hero/OverriddenDefaultHero'
import Incentives from 'app/components/sections/Incentives'
import { OverriddenDefaultNewsletter as Newsletter } from 'app/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductShelf as ProductShelf } from 'app/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'app/components/sections/ProductTiles'
import MissingContentError from 'app/sdk/error/MissingContentError/MissingContentError'
import PageProvider from 'app/sdk/overrides/PageProvider'
import type { PageContentType } from 'app/server/cms'
import { getPage } from 'app/server/cms'
import { OverriddenDefaultCrossSellingShelf as CrossSellingShelf } from 'src/components/sections/CrossSellingShelf/OverriddenDefaultCrossSellingShelf'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import storeConfig from 'faststore.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  BannerText,
  BannerNewsletter,
  CrossSellingShelf,
  Incentives,
  Newsletter,
  ProductShelf,
  ProductTiles,
  ...CUSTOM_COMPONENTS,
}

export type LandingPageProps = {
  page: PageContentType
  slug?: string
  serverData?: unknown
}

export default function LandingPage({
  page: { sections, settings },
  slug,
  serverData,
}: LandingPageProps) {
  const context = {
    data: serverData,
  }

  return (
    <>
      {/* SEO */}
      <NextSeo
        title={settings?.seo?.title ?? storeConfig.seo.title}
        description={settings?.seo?.description ?? storeConfig.seo?.description}
        titleTemplate={storeConfig.seo?.titleTemplate ?? storeConfig.seo?.title}
        canonical={
          settings?.seo?.canonical ?? `${storeConfig.storeUrl}/${slug}`
        }
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
      <PageProvider context={context}>
        <RenderSections sections={sections} components={COMPONENTS} />
      </PageProvider>
    </>
  )
}

export const getLandingPageBySlug = async (
  slug: string,
  previewData: Locator
) => {
  try {
    if (storeConfig.cms.data) {
      const cmsData = JSON.parse(storeConfig.cms.data)
      const pageBySlug = cmsData['landingPage'].find((page) => {
        slug === page.settings?.seo?.slug
      })

      if (pageBySlug) {
        const landingPageData = await getPage<PageContentType>({
          contentType: 'landingPage',
          documentId: pageBySlug.documentId,
          versionId: pageBySlug.versionId,
        })

        return landingPageData
      }
    }

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
