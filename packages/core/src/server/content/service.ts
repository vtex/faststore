import type { ContentData, Locator } from '@vtex/client-cms'
import ClientCP from '@vtex/client-cp'
import type { ContentEntry, EntryPathParams } from '@vtex/client-cp'
import { getCMSPage, getPage, type PageContentType } from 'src/server/cms'
import type { ContentOptions } from './types'
import config from '../../../discovery.config'
import { getPLP, type PLPContentType } from '../cms/plp'
import {
  findBestPDPTemplate,
  findBestPLPTemplate,
  type Rewrite,
  type RewritesConfig,
} from 'src/utils/multipleTemplates'
import MissingContentError from 'src/sdk/error/MissingContentError'
import type { ServerProductQueryQuery } from '@generated/graphql'
import { getPDP, type PDPContentType } from '../cms/pdp'
import MultipleContentError from 'src/sdk/error/MultipleContentError'

export class ContentService {
  private clientCP: ClientCP

  constructor() {
    this.clientCP = new ClientCP({
      tenant: config.api.storeId,
    })
  }

  async getSingleContent<T extends ContentData>(
    options: ContentOptions
  ): Promise<T> {
    if (options.origin === 'CP' || config.contentSource.type === 'CP') {
      return this.getFromCP<T>(options)
    }
    return getPage(options.cmsOptions as Locator)
  }

  async getContent(options: ContentOptions) {
    if (options.origin === 'CP' || config.contentSource.type === 'CP') {
      const params = this.convertOptionsToParams(options)
      const { entries } = await this.clientCP.listEntries(params)
      const data = await Promise.all(
        entries.map(async (entry) => {
          const entryData = await this.getSingleEntry(
            { ...params, entryId: entry.id },
            !!options.isPreview
          )
          return this.mergeEntryWithData(entry, entryData)
        })
      )
      return { data }
    }
    return getCMSPage(options.cmsOptions as Locator)
  }

  async getPlpContent(
    options: ContentOptions,
    rewrites: Rewrite[] | RewritesConfig
  ): Promise<PLPContentType> {
    if (options.origin === 'CP' || config.contentSource.type === 'CP') {
      const pages = (await this.getContent(options)).data
      if (!pages?.length) throw new MissingContentError(options.cmsOptions)
      return findBestPLPTemplate(
        pages,
        options.slug,
        rewrites
      ) as PLPContentType
    }
    return getPLP(options.slug, options.cmsOptions as Locator, rewrites)
  }

  async getPdpContent(
    product: ServerProductQueryQuery['product'],
    options: ContentOptions
  ): Promise<PDPContentType> {
    if (options.origin === 'CP' || config.contentSource.type === 'CP') {
      const pages = (await this.getContent(options)).data
      if (!pages.length) throw new MissingContentError(options.cmsOptions)
      return findBestPDPTemplate(pages, product) as PDPContentType
    }
    return getPDP(product, options.cmsOptions as Locator)
  }

  private async getFromCP<T extends ContentData>(
    options: ContentOptions
  ): Promise<T> {
    const params = this.convertOptionsToParams(options)
    try {
      const entry: PageContentType =
        params.entryId || params.slug
          ? await this.getSingleEntry(params, !!options.isPreview)
          : await this.fetchFirstEntry(params, !!options.isPreview)

      return entry as T
    } catch (err: unknown) {
      if (isNotFoundError(err)) console.error('Content not found', err)
      else throw err
    }
  }

  private async getSingleEntry(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    if (isPreview) {
      if (params.entryId) return this.clientCP.previewEntryById(params)
      if (params.slug) return this.clientCP.previewEntryBySlug(params)
      throw new Error('Preview requires entryId or slug')
    }
    if (params.entryId) return this.clientCP.getEntry(params)
    if (params.slug) return this.clientCP.previewEntryBySlug(params)
    throw new Error('getEntry requires entryId')
  }

  private async fetchFirstEntry(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    const { entries } = await this.clientCP.listEntries(params)
    if (!entries || entries.length === 0) {
      console.error('No entries found for params', params)
      return {} as PageContentType
    }
    if (entries.length > 1) {
      throw new MultipleContentError(params, 'CP')
    }
    return this.getSingleEntry({ ...params, entryId: entries[0].id }, isPreview)
  }

  private mergeEntryWithData(
    entry: ContentEntry,
    data: PageContentType
  ): ContentEntry & PageContentType {
    return {
      ...entry,
      ...data,
      id: entry.id,
      name: entry.name || (data.name as string) || '',
    }
  }

  private convertOptionsToParams(options: ContentOptions): EntryPathParams {
    const { cmsOptions } = options
    const params: Partial<EntryPathParams> = {
      accountName: config.api.storeId,
      storeId: 'faststore',
      contentType: cmsOptions.contentType,
      slug: options.slug,
    }

    if ('documentId' in cmsOptions && cmsOptions.documentId) {
      params.entryId = cmsOptions.documentId
    }
    if ('versionId' in cmsOptions && cmsOptions.versionId) {
      params.branchId = cmsOptions.versionId
    }
    if ('releaseId' in cmsOptions && cmsOptions.releaseId) {
      params.branchId = cmsOptions.releaseId
    }
    if ('filters' in cmsOptions && cmsOptions.filters) {
      const nested = cmsOptions.filters.filters as Record<string, any>
      if (nested['settings.seo.slug']) {
        const seo = nested['settings.seo.slug'] as string
        params.slug = seo.replace(/^\//, '')
      }
      Object.assign(params, cmsOptions.filters)
    }

    return params as EntryPathParams
  }
}

function isNotFoundError(err: unknown): boolean {
  if (err instanceof MissingContentError) return true
  if (err instanceof Error && /\b404\b/.test(err.message)) return true
  return false
}

export const contentService = new ContentService()
