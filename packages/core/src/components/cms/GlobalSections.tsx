import { Locator, Section } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import { PageContentType, getPage } from 'src/server/cms'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

export type GlobalSectionsData = {
  sections: Section[]
}

export const getGlobalSectionsData = async (
  previewData: Locator
): Promise<GlobalSectionsData> => {
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData[GLOBAL_SECTIONS_CONTENT_TYPE][0]

    if (page) {
      const pageData = getPage<PageContentType>({
        contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return pageData
    }
  }

  const pageData = getPage<PageContentType>({
    ...(previewData?.contentType === GLOBAL_SECTIONS_CONTENT_TYPE &&
      previewData),
    contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
  })

  return pageData
}
