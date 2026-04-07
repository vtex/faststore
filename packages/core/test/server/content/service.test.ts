import type { EntryPathParams } from '@vtex/client-cp'
import { describe, expect, it } from '@jest/globals'

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
})
