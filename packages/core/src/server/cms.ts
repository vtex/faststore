import type { ContentData, ContentTypeOptions, Locator } from '@vtex/client-cms'
import ClientCMS from '@vtex/client-cms'

import { ServerProductQueryQuery } from '@generated/graphql'
import MissingContentError from 'src/sdk/error/MissingContentError'
import MultipleContentError from 'src/sdk/error/MultipleContentError'
import { findBestPDPTemplate } from 'src/utils/utilities'
import config from '../../faststore.config'

export const clientCMS = new ClientCMS({
  workspace: config.api.workspace,
  tenant: config.api.storeId,
})

export type Options =
  | Locator
  | {
      contentType: string
      filters?: Partial<ContentTypeOptions>
    }

const isLocator = (x: any): x is Locator =>
  typeof x.contentType === 'string' &&
  (typeof x.releaseId === 'string' || typeof x.documentId === 'string')

export const getPage = async <T extends ContentData>(options: Options) => {
  const result = await (isLocator(options)
    ? clientCMS.getCMSPage(options).then((page) => ({ data: [page] }))
    : clientCMS.getCMSPagesByContentType(options.contentType, options.filters))

  const pages = result.data

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  if (pages.length !== 1) {
    throw new MultipleContentError(options)
  }

  return pages[0] as T
}

export const getPDPTemplatePage = async (
  slug: string,
  product: ServerProductQueryQuery['product'],
  options: Options
): Promise<PDPContentType> => {
  const result = await (isLocator(options)
    ? clientCMS.getCMSPage(options).then((page) => ({ data: [page] }))
    : clientCMS.getCMSPagesByContentType(options.contentType, options.filters))

  const pages = result.data as PDPContentType[]

  if (!pages[0]) {
    throw new MissingContentError(options)
  }

  return findBestPDPTemplate(pages, slug, product) ?? pages[0]
}

type ProductGallerySettings = {
  settings: {
    productGallery: {
      itemsPerPage: number
      sortBySelection: string
    }
  }
}

type PDPSettings = {
  settings: {
    template?: {
      value?: string
    }
  }
}

export type PDPContentType = ContentData & PDPSettings
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
