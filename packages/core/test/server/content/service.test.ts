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
})
