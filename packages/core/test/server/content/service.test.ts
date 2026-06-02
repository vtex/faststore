import type { EntryPathParams } from '@vtex/client-cp'
import { describe, expect, it } from 'vitest'

import { ContentService } from '../../../src/server/content/service'
import type {
  ContentOptions,
  ContentParams,
} from '../../../src/server/content/types'

type ContentServiceInternals = {
  createContentOptions: (params: ContentParams) => ContentOptions
  convertOptionsToParams: (options: ContentOptions) => EntryPathParams
}

const getServiceInternals = (service: ContentService) =>
  service as unknown as ContentServiceInternals

describe('ContentService', () => {
  describe('convertOptionsToParams', () => {
    it('maps a flat SEO slug filter to the client-cp slug param', () => {
      const service = getServiceInternals(new ContentService())
      const options = service.createContentOptions({
        contentType: 'landingPage',
        filters: { 'settings.seo.slug': '/summer-sale' },
      })

      const params = service.convertOptionsToParams(options)

      expect(params.slug).toBe('summer-sale')
    })

    it('keeps an explicit slug when filters also include settings.seo.slug', () => {
      const service = getServiceInternals(new ContentService())
      const options = service.createContentOptions({
        contentType: 'landingPage',
        slug: 'summer-sale',
        filters: { 'settings.seo.slug': '/other-slug' },
      })

      const params = service.convertOptionsToParams(options)

      expect(params.slug).toBe('summer-sale')
    })
  })

  describe('createContentOptions', () => {
    it('prefers the preview locale when the request falls back to the default locale', () => {
      const service = getServiceInternals(new ContentService())

      const options = service.createContentOptions({
        contentType: 'landingPage',
        locale: 'en-US',
        previewData: {
          contentType: 'landingPage',
          documentId: 'entry-1',
          versionId: 'branch-1',
          locale: 'pt-BR',
        },
      })

      expect(options.locale).toBe('pt-BR')
    })

    it('keeps the explicit route locale when it already differs from the default locale', () => {
      const service = getServiceInternals(new ContentService())

      const options = service.createContentOptions({
        contentType: 'landingPage',
        locale: 'fr-FR',
        previewData: {
          contentType: 'landingPage',
          documentId: 'entry-1',
          versionId: 'branch-1',
          locale: 'pt-BR',
        },
      })

      expect(options.locale).toBe('fr-FR')
    })

    it('does not leak the preview locale into CMS locator params', () => {
      const service = getServiceInternals(new ContentService())

      const options = service.createContentOptions({
        contentType: 'landingPage',
        locale: 'en-US',
        previewData: {
          contentType: 'landingPage',
          documentId: 'entry-1',
          versionId: 'branch-1',
          locale: 'pt-BR',
        },
      })

      expect('locale' in options.cmsOptions).toBe(false)
    })
  })

  describe('createContentOptions with variant branchId', () => {
    it('maps context.branchId to cmsOptions.versionId without enabling preview', () => {
      const service = getServiceInternals(new ContentService())

      const options = service.createContentOptions({
        contentType: 'home',
        branchId: 'campaign-x',
      })

      expect((options.cmsOptions as { versionId?: string }).versionId).toBe(
        'campaign-x'
      )
      expect(options.isPreview).toBe(false)
    })

    it('prefers context.branchId over previewData.versionId', () => {
      const service = getServiceInternals(new ContentService())

      const options = service.createContentOptions({
        contentType: 'home',
        branchId: 'campaign-x',
        previewData: {
          contentType: 'home',
          documentId: 'entry-1',
          versionId: 'branch-1',
        },
      })

      expect((options.cmsOptions as { versionId?: string }).versionId).toBe(
        'campaign-x'
      )
    })

    it('leaves behavior unchanged when branchId is absent', () => {
      const service = getServiceInternals(new ContentService())

      const options = service.createContentOptions({
        contentType: 'home',
      })

      expect('versionId' in options.cmsOptions).toBe(false)
      expect(options.isPreview).toBe(false)
    })
  })

  describe('variant branchId propagation across content types', () => {
    // Every module a variant page renders funnels its CP request through
    // ContentService, so asserting branchId reaches the CP params for each
    // content type guards against the "mixed rendering" failure mode (US2).
    const CONTENT_TYPES = [
      'home',
      'pdp',
      'plp',
      'landingPage',
      'globalSections',
      'globalHeaderSections',
      'globalFooterSections',
    ] as const

    it.each(CONTENT_TYPES)(
      'forwards branchId to the CP params for "%s"',
      (contentType) => {
        const service = getServiceInternals(new ContentService())

        const options = service.createContentOptions({
          contentType,
          branchId: 'campaign-x',
        })
        const params = service.convertOptionsToParams(options)

        expect(params.branchId).toBe('campaign-x')
        expect(options.isPreview).toBe(false)
      }
    )
  })
})
