import type { GetStaticPaths, GetStaticProps } from 'next'

import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import type { PageContentType } from 'src/server/cms'
import { injectGlobalSections } from 'src/server/cms/global'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import { getVariantBranchId } from 'src/server/content/utils'
import { getDynamicContent } from 'src/utils/dynamicContent'

// Reuse the original home page component — only the data fetching differs.
import HomePage from '../../index'

type Props = {
  page: PageContentType
  globalSections: GlobalSectionsData
  serverData?: unknown
}

export const getStaticProps: GetStaticProps<
  Props,
  { branchId: string },
  PreviewData
> = async ({ params, previewData, locale }) => {
  const branchId = getVariantBranchId(params)
  const contentContext = { previewData, locale, branchId }

  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(contentContext)
  const serverDataPromise = getDynamicContent({ pageType: 'home' })

  // The variant branch resolves its own `home` entry via branchId, so we skip
  // the build-time baked `cms.data` locators used by the main-branch page.
  const pagePromise = contentService.getSingleContent<PageContentType>({
    ...contentContext,
    contentType: 'home',
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
    },
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default HomePage
