import ClientCMS from '@vtex/client-cms'
import type { ContentData, Locator } from '@vtex/client-cms'

import config from '../../store.config'

export const clientCMS = new ClientCMS({
  workspace: config.api.workspace,
  tenant: config.api.storeId,
})

type Options =
  | Locator
  | {
      contentType: string
      filters?: Record<string, string>
    }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isLocator = (x: any): x is Locator =>
  typeof x.contentType === 'string' &&
  (typeof x.releaseId === 'string' || typeof x.documentId === 'string')

export const getPage = async <T extends ContentData>(options: Options) => {
  const result = await (isLocator(options)
    ? clientCMS.getCMSPage(options).then((page) => ({ data: [page] }))
    : clientCMS.getCMSPagesByContentType(options.contentType, options.filters))

  const pages = result.data

  if (!pages[0]) {
    throw new Error(
      `Missing content on the CMS for content type ${
        options.contentType
      }. Add content before proceeding. Context: ${JSON.stringify(
        options,
        null,
        2
      )}`
    )
  }

  if (pages.length !== 1) {
    throw new Error(
      `Multiple content defined on the CMS for content type ${
        options.contentType
      }. Remove duplicated content before proceeding. Context: ${JSON.stringify(
        options,
        null,
        2
      )}`
    )
  }

  return pages[0] as T
}

export type PDPContentType = ContentData

export type PageContentType = ContentData & {
  settings: {
    seo: {
      slug: string
      title: string
      description: string
      canonical?: string
    }
  }
}
