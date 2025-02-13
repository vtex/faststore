import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import RenderSections from 'src/components/cms/RenderSections'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import COMPONENTS from 'src/components/cms/home/Components'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { getDynamicContent } from 'src/utils/dynamicContent'
import storeConfig from '../../discovery.config'

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

  const publisherId = settings?.seo?.publisherId ?? storeConfig.seo.publisherId

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
        type="WebSite"
        name={settings?.seo?.name ?? storeConfig.seo.name}
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q`,
            queryInput: 'search_term_string',
          },
        ]}
        {...(publisherId && { publisher: { '@id': publisherId } })}
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
          globalSections={globalSections.sections}
          sections={sections}
          components={COMPONENTS}
        />
      </PageProvider>
    </>
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
