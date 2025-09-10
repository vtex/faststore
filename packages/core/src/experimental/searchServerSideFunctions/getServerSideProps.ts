import type { GetServerSideProps } from 'next'
import type { SearchPageProps } from './getStaticProps'

import storeConfig from '../../../discovery.config'
import { getGlobalSectionsData } from '../../components/cms/GlobalSections'
import { type SearchContentType, getPage } from '../../server/cms'
import { injectGlobalSections } from '../../server/cms/global'
import type { PreviewData } from '../../server/content/types'
import { contentService } from '../../server/content/service'

export const getServerSideProps: GetServerSideProps<
  SearchPageProps,
  Record<string, string>,
  PreviewData
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
        contentService.getSingleContent<SearchContentType>({
          contentType: 'search',
          previewData,
          documentId: page.documentId,
          versionId: page.versionId,
          releaseId: page.releaseId,
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
      contentService.getSingleContent<SearchContentType>({
        contentType: 'search',
        previewData,
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
