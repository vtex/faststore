import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

import RenderSections from 'src/components/cms/RenderSections'
import BannerNewsletter from 'src/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'src/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultHero as Hero } from 'src/components/sections/Hero/OverriddenDefaultHero'
import Incentives from 'src/components/sections/Incentives'
import { OverriddenDefaultNewsletter as Newsletter } from 'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductShelf as ProductShelf } from 'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'src/components/sections/ProductTiles'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { getDynamicContent } from 'src/utils/dynamicContent'
import { usePageViewEvent } from 'src/sdk/analytics/hooks/usePageViewEvent'
import storeConfig from '../../faststore.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  Incentives,
  ProductShelf,
  ProductTiles,
  BannerText,
  BannerNewsletter,
  Newsletter,
  ...CUSTOM_COMPONENTS,
}

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
  serverData?: unknown
}

function Page({
  page: { sections, settings },
  globalSections,
  serverData,
}: Props) {
  const context = {
    data: serverData,
  }

  usePageViewEvent({ pageTitle: settings?.seo?.title ?? storeConfig.seo.title })

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
      <PageProvider context={context}>
        <RenderSections sections={sections} components={COMPONENTS} />
      </PageProvider>
    </GlobalSections>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const globalSectionsPromise = getGlobalSectionsData(previewData)
  const serverDataPromise = getDynamicContent({ pageType: 'home' })

  let cmsPage = null
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    cmsPage = cmsData['home'][0]
  }
  const pagePromise = cmsPage
    ? getPage<PageContentType>({
        contentType: 'home',
        documentId: cmsPage.documentId,
        versionId: cmsPage.versionId,
      })
    : getPage<PageContentType>({
        ...(previewData?.contentType === 'home' && previewData),
        contentType: 'home',
      })
  const [page, globalSections, serverData] = await Promise.all([
    pagePromise,
    globalSectionsPromise,
    serverDataPromise,
  ])

  return {
    props: { page, globalSections, serverData },
  }
}

export default Page
