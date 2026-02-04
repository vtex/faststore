import type { Section } from '@vtex/client-cms'
import storeConfig from 'discovery.config'
import type { PageContentType } from 'src/server/cms'
import { contentService } from 'src/server/content/service'
import type { PreviewData } from 'src/server/content/types'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'
export const GLOBAL_SECTIONS_HEADER_CONTENT_TYPE = 'globalHeaderSections'
export const GLOBAL_SECTIONS_FOOTER_CONTENT_TYPE = 'globalFooterSections'

export type GlobalSectionsData = {
  sections: Section[]
  settings?: Record<string, unknown>
}

export const getGlobalSectionsByType = async (
  previewData: PreviewData,
  contentType: string,
  locale?: string
): Promise<GlobalSectionsData> => {
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData[contentType][0]

    if (page) {
      const pageData = contentService.getSingleContent<PageContentType>({
        contentType,
        previewData,
        locale,
        documentId: page.documentId,
        versionId: page.versionId,
        releaseId: page.releaseId,
      })

      return pageData
    }
  }

  const pageData = contentService.getSingleContent<PageContentType>({
    contentType,
    previewData,
    locale,
  })

  return pageData
}

export const getGlobalSectionsData = (
  previewData: PreviewData,
  locale?: string
): Promise<GlobalSectionsData>[] => {
  const globalSections = getGlobalSectionsByType(
    previewData,
    GLOBAL_SECTIONS_CONTENT_TYPE,
    locale
  )
  const globalHeaderSections = getGlobalSectionsByType(
    previewData,
    GLOBAL_SECTIONS_HEADER_CONTENT_TYPE,
    locale
  )
  const globalFooterSections = getGlobalSectionsByType(
    previewData,
    GLOBAL_SECTIONS_FOOTER_CONTENT_TYPE,
    locale
  )

  return [globalSections, globalHeaderSections, globalFooterSections]
}
