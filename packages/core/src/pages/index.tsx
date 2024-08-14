import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'

import RenderSections from 'src/components/cms/RenderSections'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import GlobalSections, {
  GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { getDynamicContent } from 'src/utils/dynamicContent'
import storeConfig from '../../faststore.config'

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
        <RenderSections sections={sections} />
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

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['home'][0]

    if (page) {
      const pageDataPromise = getPage<PageContentType>({
        contentType: 'home',
        documentId: page.documentId,
        versionId: page.versionId,
      })

      const [pageData, globalSections, serverData] = await Promise.all([
        pageDataPromise,
        globalSectionsPromise,
        serverDataPromise,
      ])

      return {
        props: { page: pageData, globalSections, serverData },
      }
    }
  }

  const pagePromise = getPage<PageContentType>({
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
