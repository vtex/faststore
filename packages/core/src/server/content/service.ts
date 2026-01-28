import type { ServerProductQueryQuery } from '@generated/graphql'
import type { ContentData, Locator } from '@vtex/client-cms'
import type { ContentEntry, EntryPathParams } from '@vtex/client-cp'
import ClientCP from '@vtex/client-cp'
import MissingContentError from 'src/sdk/error/MissingContentError'
import MultipleContentError from 'src/sdk/error/MultipleContentError'
import { getCMSPage, getPage, type PageContentType } from 'src/server/cms'
import {
  findBestPDPTemplate,
  findBestPLPTemplate,
  type Rewrite,
  type RewritesConfig,
} from 'src/utils/multipleTemplates'
import config from '../../../discovery.config'
import { getPDP, type PDPContentType } from '../cms/pdp'
import { getPLP, type PLPContentType } from '../cms/plp'
import type { ContentOptions, ContentParams } from './types'
import { isBranchPreview, isContentPlatformSource } from './utils'

type ContentResult = ContentData | (ContentEntry & PageContentType)

export class ContentService {
  private clientCPCache = new Map<string, ClientCP>()

  private getClientCP(locale?: string): ClientCP {
    const currentLocale = locale ?? config.localization.defaultLocale

    // Reuse cached ClientCP for locale
    if (this.clientCPCache.has(currentLocale)) {
      return this.clientCPCache.get(currentLocale)
    }

    // Create new instance only if not in cache
    const clientCP = new ClientCP({
      tenant: config.api.storeId,
      locale: currentLocale,
    })

    // Store in cache for future use
    this.clientCPCache.set(currentLocale, clientCP)

    return clientCP
  }

  async getSingleContent<T extends ContentData>(
    params: ContentParams
  ): Promise<T> {
    const options = this.createContentOptions(params)

    if (isContentPlatformSource()) {
      return this.getFromCP<T>(options, params.locale)
    }
    return getPage(options.cmsOptions)
  }

  async getMultipleContent(
    params: ContentParams
  ): Promise<{ data: ContentResult[] }> {
    const options = this.createContentOptions(params)

    if (isContentPlatformSource()) {
      const clientCP = this.getClientCP(params.locale)
      const serviceParams = this.convertOptionsToParams(options)
      const { entries } = await clientCP.listEntries(serviceParams)
      return this.fillEntriesWithData(
        entries,
        serviceParams,
        options.isPreview,
        params.locale
      )
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
    options: ContentOptions,
    locale?: string
  ): Promise<T> {
    const params = this.convertOptionsToParams(options)
    try {
      const entry: PageContentType = await this.getEntry(
        params,
        options.isPreview,
        locale
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
    isPreview: boolean,
    locale?: string
  ): Promise<{ data: (ContentEntry & PageContentType)[] }> {
    const data = await Promise.all(
      entries.map(async (entry) => {
        const entryData = await this.getEntryData(
          { ...serviceParams, entryId: entry.id },
          isPreview,
          locale
        )
        return this.mergeEntryWithData(entry, entryData)
      })
    )
    return { data }
  }

  private async getEntry(
    params: EntryPathParams,
    isPreview: boolean,
    locale?: string
  ): Promise<PageContentType> {
    return params.entryId || params.slug
      ? await this.getEntryData(params, isPreview, locale)
      : await this.fetchFirstEntryFromList(params, isPreview, locale)
  }

  private async getEntryData(
    params: EntryPathParams,
    isPreview: boolean,
    locale?: string
  ): Promise<PageContentType> {
    if (!params.entryId && !params.slug) {
      const operation = isPreview ? 'Preview' : 'getEntry'
      throw new Error(`${operation} requires entryId or slug`)
    }

    const clientCP = this.getClientCP(locale)

    if (isPreview) {
      return params.entryId
        ? (clientCP.previewEntryById(params) as Promise<PageContentType>)
        : (clientCP.previewEntryBySlug(params) as Promise<PageContentType>)
    }

    return params.entryId
      ? (clientCP.getEntry(params) as Promise<PageContentType>)
      : (clientCP.getEntryBySlug(params) as Promise<PageContentType>)
  }

  private async fetchFirstEntryFromList(
    params: EntryPathParams,
    isPreview: boolean,
    locale?: string
  ): Promise<PageContentType> {
    const clientCP = this.getClientCP(locale)
    const { entries } = await clientCP.listEntries(params)
    if (!entries || entries.length === 0) {
      // Optional content types - suppress warning as these are expected to be missing
      const optionalContentTypes = [
        'globalHeaderSections',
        'globalFooterSections',
      ]
      const isOptional = optionalContentTypes.includes(params.contentType)

      if (!isOptional) {
        console.warn('No entries found for params', params)
      }
      return {} as PageContentType
    }
    if (entries.length > 1) {
      throw new MultipleContentError(params)
    }
    return this.getEntryData(
      { ...params, entryId: entries[0].id },
      isPreview,
      locale
    )
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
