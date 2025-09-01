import type { GetStaticProps } from 'next'
import { NextSeo, OrganizationJsonLd, SiteLinksSearchBoxJsonLd } from 'next-seo'

import RenderSections from 'src/components/cms/RenderSections'
import type { PageContentType } from 'src/server/cms'

import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import COMPONENTS from 'src/components/cms/home/Components'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { injectGlobalSections } from 'src/server/cms/global'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import { getDynamicContent } from 'src/utils/dynamicContent'
import storeConfig from '../../discovery.config'

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
  serverData?: unknown
  appkey?: string
  apptoken?: string
}

function Page({
  page: { sections, settings },
  globalSections: globalSectionsProp,
  serverData,
  appkey,
  apptoken,
}: Props) {
  console.log('🚀 ~ PAGE appkey:', appkey)
  console.log('🚀 ~ PAGE apptoken:', apptoken)
  const { sections: globalSections, settings: globalSettings } =
    globalSectionsProp ?? {}
  const context = {
    data: serverData,
    globalSettings,
  }

  const publisherId = settings?.seo?.publisherId ?? storeConfig.seo.publisherId

  const organizationAddress = Object.entries(
    settings?.seo?.organization?.address ?? {}
  ).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, string>
  )

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

      {settings?.seo?.organization && (
        <OrganizationJsonLd
          type="Organization"
          {...(settings?.seo?.organization?.id && {
            id: settings.seo.organization.id,
          })}
          {...(settings?.seo?.organization?.url && {
            url: settings.seo.organization.url,
          })}
          {...(settings?.seo?.organization?.sameAs?.length && {
            sameAs: settings.seo.organization.sameAs,
          })}
          {...(settings?.seo?.organization?.logo && {
            logo: settings.seo.organization.logo,
          })}
          {...(settings?.seo?.organization?.name && {
            name: settings.seo.organization.name,
          })}
          {...(settings?.seo?.organization?.legalName && {
            legalName: settings.seo.organization.legalName,
          })}
          {...(settings?.seo?.organization?.email && {
            email: settings.seo.organization.email,
          })}
          {...(settings?.seo?.organization?.telephone && {
            telephone: settings.seo.organization.telephone,
          })}
          {...(settings?.seo?.organization?.image && {
            image: {
              type: 'ImageObject',
              ...(settings.seo.organization.image.url && {
                url: settings.seo.organization.image.url,
              }),
              ...(settings.seo.organization.image.caption && {
                caption: settings.seo.organization.image.caption,
              }),
              ...(settings.seo.organization.image.id && {
                id: settings.seo.organization.image.id,
              }),
            },
          })}
          {...(Object.keys(organizationAddress).length !== 0 && {
            address: organizationAddress,
          })}
        />
      )}

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
          globalSections={globalSections}
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
  PreviewData
> = async ({ previewData }) => {
  const appkey = process.env.FS_DISCOVERY_APP_KEY
  const apptoken = process.env.FS_DISCOVERY_APP_TOKEN

  console.log('🚀 ~ getStaticProps process.env.FS_DISCOVERY_APP_KEY:', appkey)
  console.log(
    '🚀 ~ getStaticProps process.env.FS_DISCOVERY_APP_TOKEN:',
    apptoken
  )

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)
  const serverDataPromise = getDynamicContent({ pageType: 'home' })

  let cmsPage = null
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    cmsPage = cmsData['home'][0]
  }

  const pagePromise = cmsPage
    ? contentService.getSingleContent<PageContentType>({
        contentType: 'home',
        previewData,
        documentId: cmsPage.documentId,
        versionId: cmsPage.versionId,
        releaseId: cmsPage.releaseId,
      })
    : contentService.getSingleContent<PageContentType>({
        contentType: 'home',
        previewData,
      })

  const [
    page,
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
    serverData,
  ] = await Promise.all([
    pagePromise,
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
    serverDataPromise,
  ])

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: {
      page,
      globalSections: globalSectionsResult,
      serverData,
      appkey,
      apptoken,
    },
  }
}

export default Page
