import type { Locator, Section } from '@vtex/client-cms'
import storeConfig from 'discovery.config'
import { type PageContentType, getPage } from 'src/server/cms'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'
export const GLOBAL_SECTIONS_HEADER_CONTENT_TYPE = 'globalHeaderSections'
export const GLOBAL_SECTIONS_FOOTER_CONTENT_TYPE = 'globalFooterSections'

export type GlobalSectionsData = {
  sections: Section[]
}

export const getGlobalSectionsByType = async (
  previewData: Locator,
  contentType: string
): Promise<GlobalSectionsData> => {
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData[contentType][0]

    if (page) {
      const pageData = getPage<PageContentType>({
        contentType: contentType,
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return pageData
    }
  }

  const pageData = getPage<PageContentType>({
    ...(previewData?.contentType === contentType && previewData),
    contentType: contentType,
  })

  return pageData
}

export const getGlobalSectionsData = (
  previewData: Locator
): Promise<GlobalSectionsData>[] => {
  const globalSections = getGlobalSectionsByType(
    previewData,
    GLOBAL_SECTIONS_CONTENT_TYPE
  )
  const globalHeaderSections = getGlobalSectionsByType(
    previewData,
    GLOBAL_SECTIONS_HEADER_CONTENT_TYPE
  )
  const globalFooterSections = getGlobalSectionsByType(
    previewData,
    GLOBAL_SECTIONS_FOOTER_CONTENT_TYPE
  )

  return [globalSections, globalHeaderSections, globalFooterSections]
}
