import type { ContentData, ContentTypeOptions, Locator } from '@vtex/client-cms'
import ClientCMS from '@vtex/client-cms'
import MissingContentError from 'src/sdk/error/MissingContentError'
import MultipleContentError from 'src/sdk/error/MultipleContentError'
import config from '../../../faststore.config'

export type Options =
  | Locator
  | {
      contentType: string
      filters?: Partial<ContentTypeOptions>
    }

type ProductGallerySettings = {
  settings: {
    productGallery: {
      itemsPerPage: number
      sortBySelection: string
    }
  }
}

export type PLPContentType = ContentData & ProductGallerySettings
export type SearchContentType = ContentData & ProductGallerySettings

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

const isLocator = (x: any): x is Locator =>
  typeof x.contentType === 'string' &&
  (typeof x.releaseId === 'string' ||
    typeof x.documentId === 'string' ||
    typeof x.versionId === 'string')

export const clientCMS = new ClientCMS({
  workspace: config.api.workspace,
  tenant: config.api.storeId,
})

export const getCMSPage = async (options: Options) => {
  return await (isLocator(options)
    ? clientCMS.getCMSPage(options).then((page) => ({ data: [page] }))
    : clientCMS.getCMSPagesByContentType(options.contentType, options.filters))
}

export const getPage = async <T extends ContentData>(options: Options) => {
  const result = await getCMSPage(options)

  const pages = result.data

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  if (pages.length !== 1) {
    throw new MultipleContentError(options)
  }

  return pages[0] as T
}
