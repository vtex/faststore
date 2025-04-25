import type { Locator } from '@vtex/client-cms'
import type { Options } from '../cms'

export type ContentProviderType = 'CMS' | 'CP'

export type ContentOptions = {
  cmsOptions: Options
  slug?: string
  accountName?: string
  storeId?: string
  origin?: string
  isPreview?: boolean
}

export type PreviewData = Locator & {
  origin?: string
  slug?: string
}
