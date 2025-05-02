import type { ContentData } from '@vtex/client-cms'
import ClientCP from '@vtex/client-cp'
import type { ContentEntry, EntryPathParams } from '@vtex/client-cp'
import { getCMSPage, getPage, type PageContentType } from 'src/server/cms'
import type { ContentOptions, ContentParams, PreviewData } from './types'
import config from '../../../discovery.config'
import { getPLP, type PLPContentType } from '../cms/plp'
import {
  findBestPDPTemplate,
  findBestPLPTemplate,
  type Rewrite,
  type RewritesConfig,
} from 'src/utils/multipleTemplates'
import MissingContentError from 'src/sdk/error/MissingContentError'
import { getPDP, type PDPContentType } from '../cms/pdp'
import MultipleContentError from 'src/sdk/error/MultipleContentError'
import { createContentOptions, isLocator } from './utils'
import type { ServerProductQueryQuery } from '@generated/graphql'

export class ContentService {
  private clientCP: ClientCP

  constructor() {
    this.clientCP = new ClientCP({
      tenant: config.api.storeId,
    })
  }

  async getSingleContent<T extends ContentData>(
    params: ContentParams
  ): Promise<T> {
    const options = createContentOptions(params)

    if (config.contentSource.type === 'CP') {
      return this.getFromCP<T>(options)
    }
    return getPage(options.cmsOptions)
  }

  async getContent(params: ContentParams) {
    const options = createContentOptions(params)

    if (config.contentSource.type === 'CP') {
      const serviceParams = this.convertOptionsToParams(options)
      const { entries } = await this.clientCP.listEntries(serviceParams)
      const data = await Promise.all(
        entries.map(async (entry) => {
          const entryData = await this.getSingleEntry(
            { ...serviceParams, entryId: entry.id },
            !!options.isPreview
          )
          return this.mergeEntryWithData(entry, entryData)
        })
      )
      return { data }
    }
    return getCMSPage(options.cmsOptions)
  }

  async getPlpContent(
    params: ContentParams,
    rewrites: Rewrite[] | RewritesConfig
  ): Promise<PLPContentType> {
    const plpParams = { ...params, contentType: 'plp' }
    const options = createContentOptions(plpParams)

    if (config.contentSource.type === 'CP') {
      const pages = (await this.getContent(plpParams)).data
      if (!pages?.length) throw new MissingContentError(options.cmsOptions)
      return findBestPLPTemplate(
        pages,
        options.slug,
        rewrites
      ) as PLPContentType
    }
    if (isLocator(options.cmsOptions)) {
      return getPLP(options.slug, options.cmsOptions, rewrites)
    }
    throw new Error('Invalid cmsOptions provided')
  }

  async getPdpContent(
    product: ServerProductQueryQuery['product'],
    params: ContentParams
  ): Promise<PDPContentType> {
    const pdpParams = { ...params, contentType: 'pdp' }
    const options = createContentOptions(pdpParams)

    if (config.contentSource.type === 'CP') {
      const pages = (await this.getContent(pdpParams)).data
      if (!pages.length) throw new MissingContentError(options.cmsOptions)
      return findBestPDPTemplate(pages, product) as PDPContentType
    }
    if (isLocator(options.cmsOptions)) {
      return getPDP(product, options.cmsOptions)
    }
    throw new Error('Invalid cmsOptions provided')
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
    // TODO: update this when CP supports fetching by slug on Data Plane
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
      throw new MultipleContentError(params)
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
