import defaultConfig from '../../discovery.config.default'
import {
  getSubDomainPrefixWarning,
  mergeDiscoveryConfig,
} from '../../src/utils/mergeDiscoveryConfig'

describe('mergeDiscoveryConfig', () => {
  describe('api.subDomainPrefix', () => {
    it('keeps the default when the store does not set it', () => {
      const config = mergeDiscoveryConfig(defaultConfig, {
        api: { storeId: 'store' },
      })

      expect(config.api.subDomainPrefix).toEqual(['www'])
    })

    it('lets the store clear the prefixes with an empty array', () => {
      const config = mergeDiscoveryConfig(defaultConfig, {
        api: { subDomainPrefix: [] },
      })

      expect(config.api.subDomainPrefix).toEqual([])
    })

    it('keeps appending non-empty arrays to the default', () => {
      const config = mergeDiscoveryConfig(defaultConfig, {
        api: { subDomainPrefix: ['shop'] },
      })

      expect(config.api.subDomainPrefix).toEqual(['www', 'shop'])
    })

    it('applies to every merge in the chain', () => {
      const storeConfig = mergeDiscoveryConfig(defaultConfig, {
        api: { subDomainPrefix: ['shop'] },
      })
      const config = mergeDiscoveryConfig(storeConfig, {
        api: { subDomainPrefix: [] },
      })

      expect(config.api.subDomainPrefix).toEqual([])
    })
  })

  it('keeps merging the other api fields', () => {
    const config = mergeDiscoveryConfig(defaultConfig, {
      api: { storeId: 'store', subDomainPrefix: [] },
    })

    expect(config.api.storeId).toBe('store')
    expect(config.api.environment).toBe(defaultConfig.api.environment)
  })

  it('keeps concatenating the other arrays', () => {
    const config = mergeDiscoveryConfig({ list: ['a'] }, { list: [] })

    expect(config.list).toEqual(['a'])
  })

  it('only clears subDomainPrefix under api', () => {
    const config = mergeDiscoveryConfig(
      { api: { subDomainPrefix: ['www'] }, other: { subDomainPrefix: ['a'] } },
      { api: { subDomainPrefix: [] }, other: { subDomainPrefix: [] } }
    )

    expect(config.api.subDomainPrefix).toEqual([])
    expect(config.other.subDomainPrefix).toEqual(['a'])
  })

  it('does not mutate the default config', () => {
    mergeDiscoveryConfig(defaultConfig, { api: { subDomainPrefix: [] } })

    expect(defaultConfig.api.subDomainPrefix).toEqual(['www'])
  })
})

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
