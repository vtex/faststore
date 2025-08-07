import storeConfig from '../../../discovery.config'
import type { GetStaticProps } from 'next'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from '../../components/cms/GlobalSections'
import type { SearchContentType } from 'src/server/cms'
import { injectGlobalSections } from '../../server/cms/global'
import { contentService } from '../../server/content/service'
import type { PreviewData } from '../../server/content/types'

export type SearchPageProps = {
  page: SearchContentType
  globalSections: GlobalSectionsData
  searchTerm?: string
}

/*
  Depending on the value of the storeConfig.experimental.enableSearchSSR flag, the function used will be getServerSideProps (./getServerSideProps).
  Our CLI that does this process of converting from getStaticProps to getServerSideProps.
*/
export const getStaticProps: GetStaticProps<
  SearchPageProps,
  Record<string, string>,
  PreviewData
> = async (context) => {
  const { previewData } = context
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
        props: { page: pageData, globalSections: globalSectionsResult },
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

  return {
    props: {
      page,
      globalSections: globalSectionsResult,
    },
  }
}
