import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { ContentData } from '@vtex/client-cms'

import RenderPageSections from 'src/components/cms/RenderPageSections'
import { mark } from 'src/sdk/tests/mark'
import { getCMSPageDataByContentType } from 'src/cms/client'

import storeConfig from '../../store.config'

export type Props = { cmsHome: ContentData }

function Page({ cmsHome }: Props) {
  return (
    <>
      {/* SEO */}
      <NextSeo
        title={storeConfig.seo.title}
        description={storeConfig.seo.description}
        titleTemplate={storeConfig.seo.titleTemplate}
        canonical={storeConfig.storeUrl}
        openGraph={{
          type: 'website',
          url: storeConfig.storeUrl,
          title: storeConfig.seo.title,
          description: storeConfig.seo.description,
        }}
      />
      <SiteLinksSearchBoxJsonLd
        url={storeConfig.storeUrl}
        potentialActions={[
          {
            target: `${storeConfig.storeUrl}/s/?q={search_term_string}`,
            queryInput: 'required name=search_term_string',
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
      <RenderPageSections sections={cmsHome.sections} />
    </>
  )
}

export async function getStaticProps() {
  const cmsHome = await getCMSPageDataByContentType('home')

  return {
    props: { cmsHome },
  }
}

Page.displayName = 'Page'
export default mark(Page)
