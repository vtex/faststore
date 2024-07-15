import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ComponentType } from 'react'

import RenderSections from 'src/components/cms/RenderSections'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { mark } from 'src/sdk/tests/mark'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import dynamic from 'next/dynamic'

import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { getDynamicContent } from 'src/utils/dynamicContent'
import storeConfig from '../../faststore.config'

// function nextDynamic(path: string, module: string) {
//   return dynamic(() => import(path).then((mod: any) => mod[module]) as Promise<React.FC<any>>)
// }

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  // Hero: nextDynamic('src/components/sections/Hero/OverriddenDefaultHero', 'OverriddenDefaultHero'),
  Hero: dynamic(
    () =>
      import('src/components/sections/Hero/OverriddenDefaultHero').then(
        (mod: any) => mod['OverriddenDefaultHero']
      ) as Promise<React.FC<any>>
  ),
  Incentives: dynamic(
    () =>
      import('src/components/sections/Incentives').then(
        (mod: any) => mod
      ) as Promise<React.FC<any>>
  ),
  ProductShelf: dynamic(
    () =>
      import(
        'src/components/sections/ProductShelf/OverriddenDefaultProductShelf'
      ).then((mod: any) => mod['OverriddenDefaultProductShelf']) as Promise<
        React.FC<any>
      >
  ),
  ProductTiles: dynamic(
    () =>
      import('src/components/sections/ProductTiles').then(
        (mod: any) => mod
      ) as Promise<React.FC<any>>
  ),
  BannerText: dynamic(
    () =>
      import(
        'src/components/sections/BannerText/OverriddenDefaultBannerText'
      ).then((mod: any) => mod['OverriddenDefaultBannerText']) as Promise<
        React.FC<any>
      >
  ),
  BannerNewsletter: dynamic(
    () =>
      import('src/components/sections/BannerNewsletter/BannerNewsletter').then(
        (mod: any) => mod
      ) as Promise<React.FC<any>>
  ),
  Newsletter: dynamic(
    () =>
      import(
        'src/components/sections/Newsletter/OverriddenDefaultNewsletter'
      ).then((mod: any) => mod['OverriddenDefaultNewsletter']) as Promise<
        React.FC<any>
      >
  ),
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
  const serverData = await getDynamicContent({ pageType: 'home' })
  const globalSections = await getGlobalSectionsData(previewData)

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['home'][0]

    if (page) {
      const pageData = await getPage<PageContentType>({
        contentType: 'home',
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return {
        props: { page: pageData, globalSections, serverData },
      }
    }
  }

  const page = await getPage<PageContentType>({
    ...(previewData?.contentType === 'home' && previewData),
    contentType: 'home',
  })

  return {
    props: { page, globalSections, serverData },
  }
}

Page.displayName = 'Page'

export default mark(Page)
