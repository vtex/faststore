import defaultConfig from '../../discovery.config.default'
import { mergeDiscoveryConfig } from '../../src/utils/mergeDiscoveryConfig'

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

    it('replaces the default prefixes instead of appending to them', () => {
      const config = mergeDiscoveryConfig(defaultConfig, {
        api: { subDomainPrefix: ['shop'] },
      })

      expect(config.api.subDomainPrefix).toEqual(['shop'])
    })

    it('does not duplicate a prefix the store repeats', () => {
      const config = mergeDiscoveryConfig(defaultConfig, {
        api: { subDomainPrefix: ['www'] },
      })

      expect(config.api.subDomainPrefix).toEqual(['www'])
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
    const config = mergeDiscoveryConfig({ list: ['a'] }, { list: ['b'] })

    expect(config.list).toEqual(['a', 'b'])
  })

  it('does not mutate the default config', () => {
    mergeDiscoveryConfig(defaultConfig, { api: { subDomainPrefix: [] } })

    expect(defaultConfig.api.subDomainPrefix).toEqual(['www'])
  })
})
