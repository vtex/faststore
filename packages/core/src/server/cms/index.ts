import type { ContentData, ContentTypeOptions, Locator } from '@vtex/client-cms'
import ClientCMS from '@vtex/client-cms'

import MissingContentError from 'src/sdk/error/MissingContentError'
import MultipleContentError from 'src/sdk/error/MultipleContentError'
import config from '../../../discovery.config'

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

export const getCMSPage = async (
  options: Options,
  cmsClient: ClientCMS = clientCMS
) => {
  if (isLocator(options)) {
    return await cmsClient
      .getCMSPage(options)
      .then((page) => ({ data: [page] }))
  }

  const pages = []
  let page = 1
  const perPage = 10
  const response = await cmsClient.getCMSPagesByContentType(
    options.contentType,
    { ...options.filters, page: page, perPage }
  )

  pages.push(...response.data)

  const totalPagesToFetch = Math.ceil(response.totalItems / perPage) // How many pages have content
  const pagesToFetch = Array.from(
    { length: totalPagesToFetch - 1 }, // We want all those pages minus the first one that we fetched
    (_, i) => i + 2 // + 1 because indices are 0 based, and + 1 because we already fetched the first
  )

  if (response.totalItems > pages.length) {
    const restOfPages = await Promise.all(
      pagesToFetch.map((i) =>
        cmsClient.getCMSPagesByContentType(options.contentType, {
          ...options.filters,
          page: i,
          perPage,
        })
      )
    )

    restOfPages.forEach((response) => {
      pages.push(...response.data)
    })
  }

  return { data: pages }
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
