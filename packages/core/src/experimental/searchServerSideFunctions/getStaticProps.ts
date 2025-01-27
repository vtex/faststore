import { GetStaticProps } from 'next'
import {
  getGlobalSectionsData,
  GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import { SearchContentType, getPage } from 'src/server/cms'
import { Locator } from '@vtex/client-cms'
import storeConfig from 'discovery.config'

export type SearchPageProps = {
  page: SearchContentType
  globalSections: GlobalSectionsData
  searchTerm?: string
}

export const getStaticProps: GetStaticProps<
  SearchPageProps,
  Record<string, string>,
  Locator
> = async (context) => {
  const { previewData } = context

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
        props: { page: pageData, globalSections },
      }
    }
  }

  const page = await getPage<SearchContentType>({
    ...(previewData?.contentType === 'search' ? previewData : null),
    contentType: 'search',
  })

  return {
    props: {
      page,
      globalSections,
    },
  }
}
