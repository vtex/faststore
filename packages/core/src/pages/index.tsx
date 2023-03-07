import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

// import RenderPageSections from 'src/components/cms/RenderPageSections'
import NextImage from 'next/future/image'
import BannerText from 'src/components/sections/BannerText'
import Hero from 'src/components/sections/Hero'
import IncentivesHeader from 'src/components/sections/Incentives/IncentivesHeader'
import Newsletter from 'src/components/sections/Newsletter'
import ProductShelf from 'src/components/sections/ProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import { mark } from 'src/sdk/tests/mark'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import storeConfig from '../../faststore.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  BannerText,
  IncentivesHeader,
  ProductShelf,
  ProductTiles,
  Newsletter,
  ...CUSTOM_COMPONENTS,
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
      <p>
        Catalog Arquivos JPG -
        https://mercafefaststore.vtexassets.com/arquivos/ids/158658/20039314_01.jpg
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/arquivos/ids/158658/20039314_01.jpg'
        }
        alt={'Tests'}
        width="360"
        height="360"
        quality="95"
        loading="eager"
      />
      <p>
        Catalog Arquivos PNG -
        https://mercafefaststore.vtexassets.com/arquivos/ids/526372/SKU-Capp-Capsula.png?v=1763654233
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/arquivos/ids/526372/SKU-Capp-Capsula.png?v=1763654233'
        }
        alt={'Tests'}
        width="360"
        height="360"
        quality="95"
        loading="eager"
      />
      <p>
        CMS file-manager JPG -
        https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/12ea02ba-dd7d-4d91-8547-eb6809c4a30e___3858c213bede843e801934ac436d80ac.jpg
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/12ea02ba-dd7d-4d91-8547-eb6809c4a30e___3858c213bede843e801934ac436d80ac.jpg'
        }
        alt={'Tests'}
        width="384"
        height="384"
        quality="95"
        loading="eager"
      />
      <p>
        CMS file-manager PNG -
        https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/ea491eac-e9b6-43b5-8275-135d07ceeb99___f1a637818ab5b0c64ea58753e24b4278.png
      </p>
      <NextImage
        src={
          'https://mercafefaststore.vtexassets.com/assets/vtex.file-manager-graphql/images/ea491eac-e9b6-43b5-8275-135d07ceeb99___f1a637818ab5b0c64ea58753e24b4278.png'
        }
        alt={'Tests'}
        width="360"
        height="360"
        quality="95"
        loading="eager"
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
      {/* <RenderPageSections sections={sections} components={COMPONENTS} /> */}
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
