import { describe, expect, it, vi } from 'vitest'

const { loaders } = vi.hoisted(() => ({
  loaders: [] as Array<() => Promise<unknown>>,
}))

vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: (loader: () => Promise<unknown>) => {
    loaders.push(loader)
    const Dynamic = () => null
    return Dynamic
  },
}))

vi.mock('src/components/sections/BannerNewsletter/BannerNewsletter', () => ({
  __esModule: true,
  default: function BannerNewsletter() {},
}))
vi.mock(
  'src/components/sections/Newsletter/OverriddenDefaultNewsletter',
  () => ({ OverriddenDefaultNewsletter: function Newsletter() {} })
)

describe('PDP newsletter sections', () => {
  it('loads BannerNewsletter and Newsletter on demand', async () => {
    await import('src/pages/[slug]/p')

    const newsletterLoaders = loaders.filter((load) =>
      load.toString().includes('Newsletter')
    )
    expect(newsletterLoaders).toHaveLength(2)

    const components = await Promise.all(
      newsletterLoaders.map((load) => load())
    )
    const names = components.map(
      (component) =>
        (component as { default?: { name: string }; name?: string }).default
          ?.name ?? (component as { name?: string }).name
    )

    expect(names.sort()).toEqual(['BannerNewsletter', 'Newsletter'])
  })
})
