import type { IUrlBuilderArgs } from 'gatsby-plugin-image'

import { urlBuilder } from '../src'
import type { ThumborProps } from '../src/utils/urlBuilder'

describe('Build thumbor url with gatsby-plugin-image', () => {
  const DEFAULT_CONFIG: IUrlBuilderArgs<ThumborProps> = {
    baseUrl: 'http://otherserver/img.jpg',
    width: 100,
    height: 100,
    format: 'auto',
    options: {
      server: 'http://thumborserver.com',
      redirectBasePath: '/assets',
    },
  } as const

  it('should handle a basic url', () => {
    expect(urlBuilder(DEFAULT_CONFIG)).toBe(
      '/assets/100x100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })

  it('should handle a basic url without base redirect', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, redirectBasePath: undefined },
      })
    ).toBe(
      'http://thumborserver.com/unsafe/100x100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })

  it('should handle flipping', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, flipHorizontal: true },
      })
    ).toBe('/assets/-100x100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg')

    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, flipVertical: true },
      })
    ).toBe('/assets/100x-100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg')

    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: {
          ...DEFAULT_CONFIG.options,
          flipHorizontal: true,
          flipVertical: true,
        },
      })
    ).toBe('/assets/-100x-100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg')
  })

  it('should handle trim', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, trim: true },
      })
    ).toBe(
      '/assets/trim/100x100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })

  it('should handle fitIn', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, fitIn: true },
      })
    ).toBe(
      '/assets/fit-in/100x100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })

  it('should handle smart cropping', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, smart: true },
      })
    ).toBe(
      '/assets/100x100/center/middle/smart/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })

  it('should handle manual cropping', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: {
          ...DEFAULT_CONFIG.options,
          manualCrop: {
            top: 10,
            left: 20,
            bottom: 60,
            right: 120,
          },
        },
      })
    ).toBe(
      '/assets/20x10:120x60/100x100/center/middle/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })

  it('should handle other alignments', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, horizontalAlign: 'left' },
      })
    ).toBe('/assets/100x100/left/middle/http%3A%2F%2Fotherserver%2Fimg.jpg')

    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: { ...DEFAULT_CONFIG.options, verticalAlign: 'top' },
      })
    ).toBe('/assets/100x100/center/top/http%3A%2F%2Fotherserver%2Fimg.jpg')
  })

  it('should handle filters', () => {
    expect(
      urlBuilder({
        ...DEFAULT_CONFIG,
        options: {
          ...DEFAULT_CONFIG.options,
          filters: {
            fill: 'blue',
            rgb: [20, 10, 40],
            grayscale: true,
          },
        },
      })
    ).toBe(
      '/assets/100x100/center/middle/filters:fill(blue):rgb(20,10,40):grayscale()/http%3A%2F%2Fotherserver%2Fimg.jpg'
    )
  })
})
