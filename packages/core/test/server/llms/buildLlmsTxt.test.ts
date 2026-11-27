import { describe, expect, it } from 'vitest'

import { buildLlmsTxt } from '../../../src/server/llms'
import { truncate } from '../../../src/server/llms/format'
import type { LlmsConfig, LlmsSources } from '../../../src/server/llms/types'

const STORE_URL = 'https://acme.example'

const baseConfig: LlmsConfig = {
  enabled: true,
  title: 'Acme Store',
  tagline: 'Curated streetwear since 2008.',
  about: 'Long-form paragraph about the brand.',
  contact: {
    email: 'support@acme.example',
    url: 'https://acme.example/contact',
  },
  maxLinksPerSection: 25,
}

const fullSources: Partial<LlmsSources> = {
  categories: [
    { name: 'Office', url: '/office', description: 'Office supplies' },
    { name: 'Technology', url: '/technology' },
  ],
  institutional: [
    { name: 'Shipping policy', url: '/shipping' },
    { name: 'Returns & exchanges', url: '/returns' },
  ],
  faq: [{ name: 'Where is my order?', url: '/faq/orders' }],
}

describe('buildLlmsTxt', () => {
  it('returns null when llms is disabled', async () => {
    const result = await buildLlmsTxt({
      config: { ...baseConfig, enabled: false },
      storeUrl: STORE_URL,
    })
    expect(result).toBeNull()
  })

  it('renders the documented section order on the happy path', async () => {
    const result = await buildLlmsTxt({
      config: baseConfig,
      storeUrl: STORE_URL,
      sources: fullSources,
    })

    expect(result).not.toBeNull()
    const body = result as string

    expect(body.startsWith('# Acme Store\n')).toBe(true)
    expect(body).toContain('> Curated streetwear since 2008.')
    expect(body).toContain('## Shop by category')
    expect(body).toContain('## Customer service')
    expect(body).toContain('## FAQ')
    expect(body).toContain('## Contact')
    expect(body).toContain('## Optional')

    const order = [
      '## Shop by category',
      '## Customer service',
      '## FAQ',
      '## Contact',
      '## Optional',
    ].map((s) => body.indexOf(s))
    const sorted = [...order].sort((a, b) => a - b)
    expect(order).toEqual(sorted)

    expect(body.endsWith('\n')).toBe(true)
    expect(body.endsWith('\n\n')).toBe(false)
  })

  it('absolutizes relative URLs against storeUrl', async () => {
    const result = await buildLlmsTxt({
      config: baseConfig,
      storeUrl: STORE_URL,
      sources: {
        categories: [{ name: 'Office', url: '/office' }],
      },
    })
    expect(result).toContain(`[Office](${STORE_URL}/office)`)
  })

  it('preserves already-absolute URLs', async () => {
    const result = await buildLlmsTxt({
      config: baseConfig,
      storeUrl: STORE_URL,
      sources: {
        categories: [{ name: 'External', url: 'https://other.example/x' }],
      },
    })
    expect(result).toContain('[External](https://other.example/x)')
  })

  it('omits sections whose builders have no content', async () => {
    const result = await buildLlmsTxt({
      config: baseConfig,
      storeUrl: STORE_URL,
    })
    expect(result).not.toBeNull()
    const body = result as string
    expect(body).not.toContain('## Shop by category')
    expect(body).not.toContain('## Customer service')
    expect(body).not.toContain('## FAQ')
    expect(body).toContain('## Contact')
  })

  it('truncates link descriptions at 120 chars', async () => {
    const longText = 'x'.repeat(200)
    const result = await buildLlmsTxt({
      config: baseConfig,
      storeUrl: STORE_URL,
      sources: {
        categories: [{ name: 'Office', url: '/office', description: longText }],
      },
    })
    const body = result as string
    const line = body.split('\n').find((l) => l.startsWith('- [Office]'))!
    const description = line.split('): ')[1]
    expect(description.length).toBeLessThanOrEqual(120)
    expect(description.endsWith('…')).toBe(true)
  })

  it('caps links per section by maxLinksPerSection', async () => {
    const many = Array.from({ length: 50 }, (_, i) => ({
      name: `Cat ${i}`,
      url: `/c/${i}`,
    }))
    const result = await buildLlmsTxt({
      config: { ...baseConfig, maxLinksPerSection: 5 },
      storeUrl: STORE_URL,
      sources: { categories: many },
    })
    const body = result as string
    const categoryLines = body
      .split('## Shop by category\n')[1]
      .split('\n##')[0]
      .split('\n')
      .filter((l) => l.startsWith('- ['))
    expect(categoryLines).toHaveLength(5)
  })

  it('renders customSections from config', async () => {
    const result = await buildLlmsTxt({
      config: {
        ...baseConfig,
        customSections: [
          {
            title: 'Press',
            items: [{ name: 'Newsroom', url: '/press' }],
          },
        ],
      },
      storeUrl: STORE_URL,
    })
    expect(result).toContain('## Press')
    expect(result).toContain('[Newsroom](https://acme.example/press)')
  })
})

describe('truncate', () => {
  it('returns the input when shorter than max', () => {
    expect(truncate('hello', 120)).toBe('hello')
  })

  it('collapses whitespace', () => {
    expect(truncate('  a   b\nc  ', 120)).toBe('a b c')
  })

  it('appends an ellipsis when over the limit', () => {
    const result = truncate('a'.repeat(200), 10)
    expect(result).toHaveLength(10)
    expect(result.endsWith('…')).toBe(true)
  })
})
