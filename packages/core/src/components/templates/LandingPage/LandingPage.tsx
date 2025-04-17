'use client'

import type { Locator } from '@vtex/client-cms'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

import RenderSections from 'src/components/cms/RenderSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'src/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultCrossSellingShelf as CrossSellingShelf } from 'src/components/sections/CrossSellingShelf/OverriddenDefaultCrossSellingShelf'
import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import Incentives from 'src/components/sections/Incentives'
import { OverriddenDefaultNewsletter as Newsletter } from 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductShelf as ProductShelf } from 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import PLUGINS_COMPONENTS from 'src/plugins'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import MissingContentError from 'src/sdk/error/MissingContentError/MissingContentError'
import PageProvider from 'src/sdk/overrides/PageProvider'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import storeConfig from 'discovery.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  Hero,
  BannerText,
  BannerNewsletter,
  CrossSellingShelf,
  Incentives,
  Newsletter,
  ProductShelf,
  ProductTiles,
  ...PLUGINS_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export type LandingPageProps = {
  page: PageContentType
  slug?: string
  serverData?: unknown
  globalSections?: Array<{ name: string; data: any }>
}

export default function LandingPage({
  page: { sections, settings },
  slug,
  serverData,
  globalSections,
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
        <RenderSections
          sections={sections}
          globalSections={globalSections}
          components={COMPONENTS}
        />
      </PageProvider>
    </>
  )
}
