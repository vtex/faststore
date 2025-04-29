import type { Section } from '@vtex/client-cms'
import storeConfig from 'discovery.config'
import type { PageContentType } from 'src/server/cms'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'
import { createContentOptions } from 'src/server/content/utils'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'
export const GLOBAL_SECTIONS_HEADER_CONTENT_TYPE = 'globalHeaderSections'
export const GLOBAL_SECTIONS_FOOTER_CONTENT_TYPE = 'globalFooterSections'

export type GlobalSectionsData = {
  sections: Section[]
}

export const getGlobalSectionsByType = async (
  previewData: PreviewData,
  contentType: string
): Promise<GlobalSectionsData> => {
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData[contentType][0]

    if (page) {
      const pageData = contentService.getSingleContent<PageContentType>(
        createContentOptions({
          contentType,
          previewData,
          documentId: page.documentId,
          versionId: page.versionId,
        })
      )

      return pageData
    }
  }

  const pageData = await contentService.getSingleContent<PageContentType>(
    createContentOptions({
      contentType: contentType,
      previewData,
    })
  )

  return pageData
}

export const getGlobalSectionsData = (
  previewData: PreviewData
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
