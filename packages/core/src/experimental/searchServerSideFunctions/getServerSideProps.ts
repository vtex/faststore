import type { GetServerSideProps } from 'next'
import type { SearchPageProps } from './getStaticProps'

import type { Locator } from '@vtex/client-cms'
import storeConfig from 'discovery.config'
import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import { type SearchContentType, getPage } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'

export const getServerSideProps: GetServerSideProps<
  SearchPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const { previewData, query, res } = context
  const searchTerm = (query.q as string)?.split('+').join(' ')

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['search'][0]
    if (page) {
      const [
        pageData,
        globalSections,
        globalSectionsHeader,
        globalSectionsFooter,
      ] = await Promise.all([
        getPage<SearchContentType>({
          contentType: 'search',
          documentId: page.documentId,
          versionId: page.versionId,
        }),
        globalSectionsPromise,
        globalSectionsHeaderPromise,
        globalSectionsFooterPromise,
      ])

      const globalSectionsResult = injectGlobalSections({
        globalSections,
        globalSectionsHeader,
        globalSectionsFooter,
      })
      return {
        props: {
          page: pageData,
          globalSections: globalSectionsResult,
          searchTerm,
        },
      }
    }
  }

  const [page, globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      getPage<SearchContentType>({
        ...(previewData?.contentType === 'search' ? previewData : null),
        contentType: 'search',
      }),
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=31536000, stale-if-error=31536000'
  ) // 5 minutes of fresh content and 1 year of stale content

  return {
    props: {
      page,
      globalSections: globalSectionsResult,
      searchTerm,
    },
  }
}
