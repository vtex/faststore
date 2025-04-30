import type { Locator } from '@vtex/client-cms'
import type { Options } from '../cms'

export type ContentProviderType = 'CMS' | 'CP'

export type PreviewData = Locator & {
  slug?: string
}

export interface ContentParams {
  contentType?: string
  previewData?: PreviewData | null
  slug?: string
  documentId?: string
  versionId?: string
  filters?: Record<string, any>
}

export interface ContentOptions {
  cmsOptions: Options
  slug?: string
  isPreview: boolean
}
