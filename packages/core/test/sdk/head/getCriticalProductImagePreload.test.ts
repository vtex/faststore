import { getCriticalProductImagePreload } from 'src/sdk/head/getCriticalProductImagePreload'

describe('getCriticalProductImagePreload', () => {
  it('returns null when no image URL is provided', () => {
    expect(getCriticalProductImagePreload()).toBeNull()
  })

  it('builds preload metadata for a valid image URL', () => {
    expect(getCriticalProductImagePreload('/product-image.jpg')).toEqual({
      rel: 'preload',
      as: 'image',
      href: '/product-image.jpg',
      fetchPriority: 'high',
    })
  })
})
