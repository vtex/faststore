import type { GetServerSideProps } from 'next'
import type { SearchPageProps } from './getStaticProps'

import storeConfig from 'discovery.config'
import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import type { SearchContentType } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import { withLocaleValidationSSR } from 'src/utils/withLocaleValidation'

const getServerSidePropsBase: GetServerSideProps<
  SearchPageProps,
  Record<string, string>,
  PreviewData
> = async (context) => {
  const { previewData, query, res, locale } = context
  const searchTerm = (query.q as string)?.split('+').join(' ')

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData, locale)

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
          locale,
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

export const getServerSideProps = withLocaleValidationSSR(
  getServerSidePropsBase
)
