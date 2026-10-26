import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getStaticProps } from '../../../src/pages/[slug]/p'
import { getGlobalSectionsData } from '../../../src/components/cms/GlobalSections'
import { execute } from '../../../src/server'
import { injectGlobalSections } from '../../../src/server/cms/global'
import { contentService } from '../../../src/server/content/service'

vi.mock('../../../src/server', () => ({ execute: vi.fn() }))
vi.mock('../../../src/components/cms/GlobalSections', () => ({
  getGlobalSectionsData: vi.fn(),
}))
vi.mock('../../../src/server/cms/global', () => ({
  injectGlobalSections: vi.fn(),
}))

const productWith = (offers: unknown[]) => ({
  seo: {
    title: 'Unavailable product',
    description: 'A product with no offer',
    canonical: '/unavailable-product/p',
  },
  offers: { priceCurrency: 'USD', offers },
})

const staticProps = async (offers: unknown[]) => {
  vi.mocked(execute).mockResolvedValue({
    data: { product: productWith(offers) },
    errors: [],
  } as never)

  return getStaticProps({
    params: { slug: 'unavailable-product' },
    locale: 'en-US',
  } as never)
}

describe('PDP getStaticProps', () => {
  beforeEach(() => {
    vi.mocked(getGlobalSectionsData).mockReturnValue([
      Promise.resolve({}),
      Promise.resolve({}),
      Promise.resolve({}),
    ] as never)
    vi.mocked(injectGlobalSections).mockReturnValue({} as never)
    vi.spyOn(contentService, 'getPdpContent').mockResolvedValue({} as never)
  })

  it('omits offers from the props of a product with no offer', async () => {
    const result = await staticProps([])

    expect(result).toHaveProperty('props')
    const { props } = result as { props: Record<string, unknown> }
    expect(props).not.toHaveProperty('offers')
    expect(Object.values(props)).not.toContain(undefined)
  })

  it('keeps the JSON-LD offer of a product that has one', async () => {
    const result = await staticProps([
      { price: 10, availability: 'https://schema.org/InStock' },
    ])

    const { props } = result as { props: Record<string, unknown> }
    expect(props.offers).toMatchObject({ priceCurrency: 'USD', price: 10 })
  })
})
