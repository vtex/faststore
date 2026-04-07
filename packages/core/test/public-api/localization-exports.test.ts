import { describe, expect, it } from 'vitest'

describe('@faststore/core localization public API', () => {
  it('exports LocalizationButton, LocalizationSelector, and useBindingSelector', async () => {
    const { LocalizationButton, LocalizationSelector, useBindingSelector } =
      await import('../../localization')

    expect(LocalizationButton).toBeTypeOf('function')
    expect(LocalizationSelector).toBeTypeOf('function')
    expect(useBindingSelector).toBeTypeOf('function')
  })

  it('re-exports the same LocalizationButton reference as the core navbar (US-1)', async () => {
    const { LocalizationButton: pub } = await import('../../localization')
    const { default: internal } = await import(
      '../../src/components/ui/LocalizationButton/LocalizationButton'
    )

    expect(pub).toBe(internal)
  })

  it('re-exports the same LocalizationSelector reference as used internally (US-2)', async () => {
    const { LocalizationSelector: pub } = await import('../../localization')
    const { default: internal } = await import(
      '../../src/components/localization/LocalizationSelector/LocalizationSelector'
    )

    expect(pub).toBe(internal)
  })

  it('re-exports the same useBindingSelector reference as the SDK module (US-2)', async () => {
    const { useBindingSelector: pub } = await import('../../localization')
    const { useBindingSelector: internal } = await import(
      '../../src/sdk/localization'
    )

    expect(pub).toBe(internal)
  })

  it('exposes types from the public entry (US-3)', async () => {
    const mod = await import('../../localization')
    expect(mod).toHaveProperty('LocalizationButton')
    expect(mod).toHaveProperty('LocalizationSelector')
    expect(mod).toHaveProperty('useBindingSelector')
  })
})
