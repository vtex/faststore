import { describe, expect, it } from 'vitest'
import { getSubDomainPrefixWarning } from '../../src/utils/subDomainPrefixWarning'

describe('getSubDomainPrefixWarning', () => {
  const store = (
    subDomainPrefix: string[] | undefined,
    secureSubdomain: string,
    storeUrl = 'https://www.store.com'
  ) => ({ storeUrl, secureSubdomain, api: { subDomainPrefix } })

  it('warns when the prefixes are cleared and checkout is on another host', () => {
    expect(
      getSubDomainPrefixWarning(store([], 'https://secure.store.com'))
    ).toContain('secure.store.com')
  })

  it('does not warn when checkout is on the storefront host', () => {
    expect(
      getSubDomainPrefixWarning(store([], 'https://www.store.com'))
    ).toBeUndefined()
  })

  it('does not warn when the store keeps any prefix', () => {
    expect(
      getSubDomainPrefixWarning(store(['www'], 'https://secure.store.com'))
    ).toBeUndefined()
    expect(
      getSubDomainPrefixWarning(store(undefined, 'https://secure.store.com'))
    ).toBeUndefined()
  })

  it('does not warn when secureSubdomain is not set', () => {
    expect(getSubDomainPrefixWarning(store([], ''))).toBeUndefined()
  })

  it('warns when secureSubdomain is not a valid URL', () => {
    expect(getSubDomainPrefixWarning(store([], 'secure.store.com'))).toContain(
      'secureSubdomain could not be parsed'
    )
  })

  it('warns when storeUrl is not a valid URL', () => {
    expect(
      getSubDomainPrefixWarning(
        store([], 'https://secure.store.com', 'www.store.com')
      )
    ).toContain('storeUrl could not be parsed')
  })
})
