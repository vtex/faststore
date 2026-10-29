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
import { createPromiseCache } from './promiseCache'
import type { ContentOptions, ContentParams } from './types'
import { isBranchPreview, isContentPlatformSource } from './utils'

type ContentResult = ContentData | PageContentType

const CONTENT_AUTHOR_FIELDS = ['createdBy', 'updatedBy'] as const

const OPTIONAL_CONTENT_TYPES = [
  'globalHeaderSections',
  'globalFooterSections',
] as const

export class ContentService {
  private readonly clientCP = new ClientCP({
    tenant: config.api.storeId,
  })

  private readonly contentListCache = createPromiseCache<{
    data: ContentResult[]
  }>()

  private readonly firstEntryCache = createPromiseCache<PageContentType>()

  async getSingleContent<T extends ContentData>(
    params: ContentParams
  ): Promise<T> {
    const options = this.createContentOptions(params)

    if (isContentPlatformSource()) {
      return this.getFromCP<T>(options)
    }
    return getPage(options.cmsOptions, { cache: !options.isPreview })
  }

  async getMultipleContent(
    params: ContentParams
  ): Promise<{ data: ContentResult[] }> {
    const options = this.createContentOptions(params)

    if (isContentPlatformSource()) {
      const serviceParams = this.convertOptionsToParams(options)

      if (options.isPreview) {
        return this.listAndFillEntries(serviceParams, true)
      }

      return this.getCachedContentList(serviceParams)
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
      const directMatch = await this.getSingleContent<PLPContentType>(plpParams)
      if (directMatch) {
        return directMatch
      }

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
      const directMatch = await this.getSingleContent<PDPContentType>(pdpParams)
      if (directMatch) {
        return directMatch
      }

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

  private getCachedContentList(
    serviceParams: EntryPathParams
  ): Promise<{ data: ContentResult[] }> {
    return this.contentListCache.get(getContentTypeKey(serviceParams), () =>
      this.listAndFillEntries(serviceParams, false)
    )
  }

  private async listAndFillEntries(
    serviceParams: EntryPathParams,
    isPreview: boolean
  ): Promise<{ data: PageContentType[] }> {
    // TODO: This should be temporary until the cp data-plane have a search engine.
    const MAX_PAGES = 25
    const allEntries: ContentEntry[] = []
    let scroll: string | undefined
    let pages = 0

    do {
      const result = await this.clientCP.listEntries(serviceParams, scroll)
      allEntries.push(...result.entries)
      const next = result.scroll ?? undefined
      if (next && next === scroll) break
      scroll = next
    } while (scroll && ++pages < MAX_PAGES)

    if (pages >= MAX_PAGES) {
      console.warn('listEntries pagination hit MAX_PAGES cap', serviceParams)
    }

    return this.fillEntriesWithData(allEntries, serviceParams, isPreview)
  }

  private async fillEntriesWithData(
    entries: ContentEntry[],
    serviceParams: EntryPathParams,
    isPreview: boolean
  ): Promise<{ data: PageContentType[] }> {
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
    if (params.entryId || params.slug) {
      return this.getEntryData(params, isPreview)
    }

    if (isPreview) {
      return this.fetchFirstEntryFromList(params, true)
    }

    // An empty required type is likely content that is about to be published,
    // so it is not kept for the whole TTL. Optional types are empty by design.
    return this.firstEntryCache.get(
      getContentTypeKey(params),
      () => this.fetchFirstEntryFromList(params, false),
      (entry) => !isEmptyEntry(entry) || isOptionalContentType(params)
    )
  }

  private async getEntryData(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    if (!params.entryId && !params.slug) {
      const operation = isPreview ? 'Preview' : 'getEntry'
      throw new Error(`${operation} requires entryId or slug`)
    }

    const entry = await this.loadEntry(params, isPreview)

    return withoutContentAuthorMetadata(entry as PageContentType)
  }

  private loadEntry(params: EntryPathParams, isPreview: boolean) {
    if (isPreview) {
      return params.entryId
        ? this.clientCP.previewEntryById(params)
        : this.clientCP.previewEntryBySlug(params)
    }

    return params.entryId
      ? this.clientCP.getEntry(params)
      : this.clientCP.getEntryBySlug(params)
  }

  private async fetchFirstEntryFromList(
    params: EntryPathParams,
    isPreview: boolean
  ): Promise<PageContentType> {
    const { entries } = await this.clientCP.listEntries(params)
    if (!entries || entries.length === 0) {
      if (!isOptionalContentType(params)) {
        console.warn('No entries found for params', params)
      }
      return {} as PageContentType
    }
    if (entries.length > 1) {
      throw new MultipleContentError(params)
    }
    return this.getEntryData({ ...params, entryId: entries[0].id }, isPreview)
  }

  private createContentOptions(params: ContentParams): ContentOptions {
    const { contentType, previewData, slug, locale } = params
    const previewLocale = previewData?.locale
    const effectiveLocale =
      previewLocale !== undefined &&
      (locale === undefined || locale === config.session.locale)
        ? previewLocale
        : locale

    const contentPreviewEnabled = previewData?.contentType === contentType
    const branchPreviewEnabled = isBranchPreview(previewData)

    return {
      cmsOptions: this.buildCmsOptions(
        params,
        contentPreviewEnabled,
        branchPreviewEnabled
      ),
      ...(effectiveLocale !== undefined && { locale: effectiveLocale }),
      ...(slug !== undefined && { slug }),
      isPreview: contentPreviewEnabled || branchPreviewEnabled,
    }
  }

  private convertOptionsToParams(options: ContentOptions): EntryPathParams {
    const { cmsOptions } = options
    const params: Partial<EntryPathParams> = {
      accountName: config.api.storeId,
      storeId:
        (config.contentSource as Record<string, string>)?.project ??
        'faststore',
      contentType: cmsOptions.contentType,
      locale: options.locale,
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
      const filters = cmsOptions.filters as Record<string, unknown>
      const seo = filters['settings.seo.slug']

      if (typeof seo === 'string' && !params.slug) {
        params.slug = seo.replace(/^\//, '')
      }
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
    const { slug: _, locale: __, ...previewLocator } = previewData ?? {}

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
  ): PageContentType {
    return {
      ...withoutContentAuthorMetadata(data),
      id: entry.id,
      name: entry.name ?? '',
    }
  }
}

function isOptionalContentType({ contentType }: EntryPathParams): boolean {
  return OPTIONAL_CONTENT_TYPES.includes(
    contentType as (typeof OPTIONAL_CONTENT_TYPES)[number]
  )
}

function isEmptyEntry(entry: PageContentType): boolean {
  return Object.keys(entry).length === 0
}

// listEntries only depends on these fields; the page slug must stay out of the key.
function getContentTypeKey({
  accountName,
  storeId,
  contentType,
  locale,
}: EntryPathParams): string {
  return JSON.stringify([accountName, storeId, contentType, locale])
}

function withoutContentAuthorMetadata<T extends object>(value: T): T {
  const content = { ...value } as Record<string, unknown>

  for (const field of CONTENT_AUTHOR_FIELDS) {
    delete content[field]
  }

  return content as T
}

function isNotFoundError(err: unknown): boolean {
  if (err instanceof MissingContentError) return true
  if (err instanceof Error && /\b404\b/.test(err.message)) return true
  return false
}

export const contentService = new ContentService()
