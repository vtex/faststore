import { NextSeo, SiteLinksSearchBoxJsonLd } from 'next-seo'
import type { GetStaticProps } from 'next'
import type { ContentData, Locator } from '@vtex/client-cms'

import RenderPageSections from 'src/components/cms/RenderPageSections'
import { mark } from 'src/sdk/tests/mark'
import { clientCMS } from 'src/server/cms'

import storeConfig from '../../store.config'

interface Props {
  sections: ContentData['sections']
}

function Page({ sections }: Props) {
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
      <RenderPageSections sections={sections} />
    </>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async (context) => {
  const contentType = 'home'
  const page =
    context.preview && context.previewData?.contentType === contentType
      ? await clientCMS.getCMSPage(context.previewData)
      : await clientCMS
          .getCMSPagesByContentType(contentType)
          .then((pages) => pages.data[0])

  return {
    props: {
      sections: page?.sections ?? [],
    },
  }
}

Page.displayName = 'Page'
export default mark(Page)
