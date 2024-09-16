import type { PageContentType } from 'app/server/cms'
import { getPage } from 'app/server/cms'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import RenderSections from 'app/components/cms/RenderSections'
import { OverriddenDefaultBannerText as BannerText } from 'app/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultHero as Hero } from 'app/components/sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultNewsletter as Newsletter } from 'app/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductShelf as ProductShelf } from 'app/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import BannerNewsletter from 'app/components/sections/BannerNewsletter/BannerNewsletter'
import ProductTiles from 'app/components/sections/ProductTiles'

import Incentives from 'app/components/sections/Incentives'
import PageProvider from 'app/sdk/overrides/PageProvider'
import { getDynamicContent } from 'app/utils/dynamicContent'
import { ComponentType } from 'react'

import storeConfig from '../../faststore.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  Incentives,
  ProductShelf,
  BannerText,
  BannerNewsletter,
  Newsletter,
  ProductTiles,
  ...CUSTOM_COMPONENTS,
}

const getHomeData = async () => {
  const serverData = await getDynamicContent({ pageType: 'home' })

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['home'][0]

    if (page) {
      const pageData = await getPage<PageContentType>({
        contentType: 'home',
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return { page: pageData, serverData }
    }
  }
  /* TODO: we should use DraftMode instead of preview mode in Next 13 */
  const page = await getPage<PageContentType>({
    contentType: 'home',
  })

  return { page, serverData }
}

export async function generateMetadata() {
  const {
    page: { settings },
  } = await getHomeData()
  return {
    title: settings?.seo?.title ?? storeConfig.seo.title,
    description: settings?.seo?.description ?? storeConfig.seo?.description,
    titleTemplate: storeConfig.seo?.titleTemplate ?? storeConfig.seo?.title,
    alternates: {
      canonical: settings?.seo?.canonical ?? storeConfig.storeUrl,
    },
    metadataBase: new URL(storeConfig.storeUrl),
    openGraph: {
      type: 'website',
      url: storeConfig.storeUrl,
      title: settings?.seo?.title ?? storeConfig.seo.title,
      description: settings?.seo?.description ?? storeConfig.seo.description,
    },
  }
}

async function Page() {
  const {
    page: { sections },
    serverData,
  } = await getHomeData()

  const context = {
    data: serverData,
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: storeConfig.storeUrl,
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: `${storeConfig.storeUrl}/s/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ],
  }

  return (
    <>
      {/* Adding JSON-LD schema to the page */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageProvider context={context}>
        <RenderSections sections={sections} components={COMPONENTS} />
      </PageProvider>
    </>
  )
}

Page.displayName = 'Page'

/*TODO: We should change the mark function to support server components*/
export default Page
