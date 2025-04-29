import type { ContentOptions, PreviewData } from './types'

export function createContentOptions({
  contentType,
  previewData,
  slug,
  documentId,
  versionId,
  filters,
  customCmsOptions = {},
}: {
  contentType: string
  previewData?: PreviewData | null
  slug?: string
  documentId?: string
  versionId?: string
  filters?: Record<string, any>
  customCmsOptions?: Record<string, any>
}): ContentOptions {
  const isPreview = previewData?.contentType === contentType
  const {
    origin: previewOrigin,
    slug: _,
    ...previewLocator
  } = previewData || {}

  const cmsOptions = {
    contentType,
    ...(isPreview ? previewLocator : {}),
    ...(documentId !== undefined && { documentId }),
    ...(versionId !== undefined && { versionId }),
    ...(filters && { filters }),
    ...customCmsOptions,
  }

  return {
    cmsOptions,
    ...(slug !== undefined && { slug }),
    ...(isPreview && previewOrigin && { origin: previewOrigin }),
    isPreview,
  }
}
