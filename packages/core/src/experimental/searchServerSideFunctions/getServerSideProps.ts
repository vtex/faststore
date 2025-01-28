import { GetServerSideProps } from 'next'
import { SearchPageProps } from './getStaticProps'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'
import { SearchContentType, getPage } from 'src/server/cms'
import { Locator } from '@vtex/client-cms'
import storeConfig from 'discovery.config'

export const getServerSideProps: GetServerSideProps<
  SearchPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const { previewData, query, res } = context
  const searchTerm = (query.q as string)?.split('+').join(' ')

  const globalSections = await getGlobalSectionsData(previewData)

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['search'][0]
    if (page) {
      const pageData = await getPage<SearchContentType>({
        contentType: 'search',
        documentId: page.documentId,
        versionId: page.versionId,
      })
      return {
        props: { page: pageData, globalSections, searchTerm },
      }
    }
  }

  const page = await getPage<SearchContentType>({
    ...(previewData?.contentType === 'search' ? previewData : null),
    contentType: 'search',
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=300, stale-while-revalidate=31536000, stale-if-error=31536000'
  ) // 5 minutes of fresh content and 1 year of stale content

  return {
    props: {
      page,
      globalSections,
      searchTerm,
    },
  }
}
