import { getCriticalProductImagePreload } from 'src/components/ui/Image/getCriticalProductImagePreload'

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

  it('transforms VTEX IDs image URLs using the expected preload sizing', () => {
    expect(
      getCriticalProductImagePreload(
        '/ids/1557582/image-6.jpg?v=638808503053270000'
      )
    ).toEqual({
      rel: 'preload',
      as: 'image',
      href: '/ids/1557582-320-auto/image-6.webp?v=638808503053270000&quality=8',
      fetchPriority: 'high',
    })
  })
})
