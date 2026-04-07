import type { Locator } from '@vtex/client-cms'
import type { Options } from '../cms'

export const ContentSourceType = {
  ContentPlatform: 'cp',
}

export type PreviewData = Locator & {
  slug?: string
  locale?: string
}

export interface ContentRequestContext {
  previewData?: PreviewData | null
  locale?: string
}

export interface ContentParams extends ContentRequestContext {
  contentType?: string
  slug?: string
  documentId?: string
  versionId?: string
  releaseId?: string
  filters?: Record<string, unknown>
  locale?: string
}

export interface ContentOptions {
  cmsOptions: Options
  locale?: string
  slug?: string
  isPreview: boolean
}
