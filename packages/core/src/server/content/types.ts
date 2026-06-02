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
  /**
   * A/B test variant branch. When set, all CP calls resolve content from this
   * branch (mapped to the CP `branchId`) without enabling preview mode, so ISR
   * stays intact. Sourced from the `__variant` querystring via middleware.
   */
  branchId?: string
}

export interface ContentParams extends ContentRequestContext {
  contentType?: string
  slug?: string
  documentId?: string
  versionId?: string
  releaseId?: string
  filters?: Record<string, string>
  locale?: string
}

export interface ContentOptions {
  cmsOptions: Options
  locale?: string
  slug?: string
  isPreview: boolean
}
