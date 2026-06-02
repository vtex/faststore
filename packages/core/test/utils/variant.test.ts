import { describe, expect, it } from 'vitest'

import { resolveVariantRewrite } from '../../src/utils/variant'

const requestUrl = (path: string) => new URL(`https://store.example.com${path}`)

describe('resolveVariantRewrite', () => {
  it('rewrites to the internal variant route when __variant is present', () => {
    const rewritten = resolveVariantRewrite(
      requestUrl('/produto/p?__variant=campaign-x')
    )

    expect(rewritten?.pathname).toBe('/_variant/campaign-x/produto/p')
  })

  it('does not rewrite when __variant is empty', () => {
    expect(
      resolveVariantRewrite(requestUrl('/produto/p?__variant='))
    ).toBeNull()
  })

  it('does not rewrite when __variant is absent', () => {
    expect(resolveVariantRewrite(requestUrl('/produto/p'))).toBeNull()
  })

  it('preserves other querystring params in the rewrite', () => {
    const rewritten = resolveVariantRewrite(
      requestUrl('/produto/p?__variant=campaign-x&utm_source=newsletter')
    )

    expect(rewritten?.pathname).toBe('/_variant/campaign-x/produto/p')
    expect(rewritten?.searchParams.get('utm_source')).toBe('newsletter')
  })
})
