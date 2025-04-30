import type { Locator } from '@vtex/client-cms'

import type { ContentOptions, ContentParams } from './types'

export function createContentOptions(params: ContentParams): ContentOptions {
  const { contentType, previewData, slug, documentId, versionId, filters } =
    params

  const isPreview = previewData?.contentType === contentType
  const { slug: _, ...previewLocator } = previewData || {}

  const cmsOptions = {
    contentType,
    ...(isPreview ? previewLocator : {}),
    ...(documentId !== undefined && { documentId }),
    ...(versionId !== undefined && { versionId }),
    ...(filters && { filters }),
  }

  return {
    cmsOptions,
    ...(slug !== undefined && { slug }),
    isPreview,
  }
}

export function isLocator(obj: any): obj is Locator {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.contentType === 'string' &&
    typeof obj.documentId === 'string' &&
    (typeof obj.versionId === 'string' || obj.versionId === undefined) &&
    (typeof obj.releaseId === 'string' || obj.releaseId === undefined)
  )
}
