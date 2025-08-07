import type { ContentData, Locator } from '@vtex/client-cms'
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
} from '../../utils/multipleTemplates'
import MissingContentError from 'src/sdk/error/MissingContentError'
import { getPDP, type PDPContentType } from '../cms/pdp'
import MultipleContentError from 'src/sdk/error/MultipleContentError'
import type { ServerProductQueryQuery } from '@generated/graphql'
import { isBranchPreview, isContentPlatformSource } from './utils'

type ContentResult = ContentData | (ContentEntry & PageContentType)

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
    const options = this.createContentOptions(params)

    if (isContentPlatformSource()) {
      return this.getFromCP<T>(options)
    }
    return getPage(options.cmsOptions)
  }

  async getMultipleContent(
    params: ContentParams
  ): Promise<{ data: ContentResult[] }> {
    const options = this.createContentOptions(params)

    if (isContentPlatformSource()) {
      const serviceParams = this.convertOptionsToParams(options)
      const { entries } = await this.clientCP.listEntries(serviceParams)
      return this.fillEntriesWithData(entries, serviceParams, options.isPreview)
    }
    return getCMSPage(options.cmsOptions)
  }

  async getPlpContent(
    params: ContentParams,
    rewrites: Rewrite[] | RewritesConfig
  ): Promise<PLPContentType> {
    const plpParams = { ...params, contentType: 'plp' }
    const options = this.createContentOptions(plpParams)

    if (isContentPlatformSource()) {
      const pages = (await this.getMultipleContent(plpParams)).data
      if (!pages?.length) throw new MissingContentError(options.cmsOptions)
      return findBestPLPTemplate(
        pages as Partial<PLPContentType>[],
        options.slug,
        rewrites
      ) as PLPContentType
    }
    return getPLP(options.slug, options.cmsOptions as Locator, rewrites)
  }

  async getPdpContent(
    product: ServerProductQueryQuery['product'],
    params: ContentParams
  ): Promise<PDPContentType> {
    const pdpParams = { ...params, contentType: 'pdp' }
    const options = this.createContentOptions(pdpParams)

    if (isContentPlatformSource()) {
      const pages = (await this.getMultipleContent(pdpParams)).data
      if (!pages.length) throw new MissingContentError(options.cmsOptions)
      return findBestPDPTemplate(
        pages as Partial<PDPContentType>[],
        product
      ) as PDPContentType
    }
    return getPDP(product, options.cmsOptions as Locator)
  }

  private async getFromCP<T extends ContentData>(
    options: ContentOptions
  ): Promise<T> {
    const params = this.convertOptionsToParams(options)
    try {
      const entry: PageContentType = await this.getEntry(
        params,
        options.isPreview
      )
      return entry as T
    } catch (err: unknown) {
      if (isNotFoundError(err)) console.warn('Content not found', err)
      else throw err
    }
  }

  private async fillEntriesWithData(
    entries: ContentEntry[],
    serviceParams: EntryPathParams,
    isPreview: boolean
  ): Promise<{ data: (ContentEntry & PageContentType)[] }> {
    const data = await Promise.all(
      entries.map(async (entry) => {
        const entryData = await this.getEntryData(
          { ...serviceParams, entryId: entry.id },
          isPreview
        )
        return this.mergeEntryWithData(entry, entryData)
      })
    )
    return { data }
  }

  private async getEntry(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    return params.entryId || params.slug
      ? await this.getEntryData(params, isPreview)
      : await this.fetchFirstEntryFromList(params, isPreview)
  }

  private async getEntryData(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    if (!params.entryId && !params.slug) {
      const operation = isPreview ? 'Preview' : 'getEntry'
      throw new Error(`${operation} requires entryId or slug`)
    }

    if (isPreview) {
      return params.entryId
        ? (this.clientCP.previewEntryById(params) as Promise<PageContentType>)
        : (this.clientCP.previewEntryBySlug(params) as Promise<PageContentType>)
    }

    return params.entryId
      ? (this.clientCP.getEntry(params) as Promise<PageContentType>)
      : (this.clientCP.getEntryBySlug(params) as Promise<PageContentType>)
  }

  private async fetchFirstEntryFromList(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    const { entries } = await this.clientCP.listEntries(params)
    if (!entries || entries.length === 0) {
      console.warn('No entries found for params', params)
      return {} as PageContentType
    }
    if (entries.length > 1) {
      throw new MultipleContentError(params)
    }
    return this.getEntryData({ ...params, entryId: entries[0].id }, isPreview)
  }

  private createContentOptions(params: ContentParams): ContentOptions {
    const { contentType, previewData, slug } = params

    const contentPreviewEnabled = previewData?.contentType === contentType
    const branchPreviewEnabled = isBranchPreview(previewData)

    return {
      cmsOptions: this.buildCmsOptions(
        params,
        contentPreviewEnabled,
        branchPreviewEnabled
      ),
      ...(slug !== undefined && { slug }),
      isPreview: contentPreviewEnabled || branchPreviewEnabled,
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
      const nested = (
        cmsOptions.filters as { filters?: Record<string, unknown> }
      ).filters as Record<string, unknown>
      if (nested && nested['settings.seo.slug']) {
        const seo = nested['settings.seo.slug'] as string
        params.slug = seo.replace(/^\//, '')
      }
      Object.assign(params, cmsOptions.filters)
    }

    return params as EntryPathParams
  }

  private buildCmsOptions(
    params: ContentParams,
    isContentPreview: boolean,
    isBranchPreview: boolean
  ) {
    const {
      contentType,
      previewData,
      documentId,
      versionId,
      releaseId,
      filters,
    } = params
    const { slug: _, ...previewLocator } = previewData || {}

    return {
      contentType,
      ...(isContentPreview ? previewLocator : {}),
      ...(isBranchPreview && {
        versionId: previewData?.versionId,
        releaseId: previewData?.releaseId,
      }),
      ...(documentId !== undefined && { documentId }),
      ...(versionId !== undefined && { versionId }),
      ...(releaseId !== undefined && { releaseId }),
      ...(filters && { filters }),
    }
  }

  private mergeEntryWithData(
    entry: ContentEntry,
    data: PageContentType
  ): ContentEntry & PageContentType {
    return {
      ...entry,
      ...data,
      id: entry.id,
      name: entry.name || '',
    }
  }
}

function isNotFoundError(err: unknown): boolean {
  if (err instanceof MissingContentError) return true
  if (err instanceof Error && /\b404\b/.test(err.message)) return true
  return false
}

export const contentService = new ContentService()
