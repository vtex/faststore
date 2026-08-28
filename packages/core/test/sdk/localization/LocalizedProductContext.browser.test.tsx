import { renderHook } from '@testing-library/react'
import type { PropsWithChildren } from 'react'
import { describe, expect, it } from 'vitest'

import {
  LocalizedProductProvider,
  useLocalizedProduct,
} from '../../../src/sdk/localization/LocalizedProductContext'

const OTHER_LOCALES = [
  { locale: 'en-US', slug: 'roshe-tenis-76' },
  { locale: 'pt-BR', slug: 'tenis-roshe-76' },
]

function readContext(
  props: Omit<
    Parameters<typeof LocalizedProductProvider>[0],
    'children' | 'otherLocales'
  > & {
    otherLocales?: Parameters<
      typeof LocalizedProductProvider
    >[0]['otherLocales']
  }
) {
  return renderHook(() => useLocalizedProduct(), {
    wrapper: ({ children }: PropsWithChildren) => (
      <LocalizedProductProvider otherLocales={null} {...props}>
        {children}
      </LocalizedProductProvider>
    ),
  }).result.current
}

describe('LocalizedProductContext', () => {
  it('exposes both slug sources to the locale selector', () => {
    expect(
      readContext({
        otherLocales: OTHER_LOCALES,
        defaultLocaleSlug: 'roshe-tenis-76',
      })
    ).toEqual({
      otherLocales: OTHER_LOCALES,
      defaultLocaleSlug: 'roshe-tenis-76',
      urlSuffix: '/p',
    })
  })

  it('normalizes absent values to null so consumers need not distinguish them', () => {
    expect(readContext({ otherLocales: undefined })).toEqual({
      otherLocales: null,
      defaultLocaleSlug: null,
      urlSuffix: '/p',
    })
  })

  it('carries no default-locale slug on collection pages, which have no product', () => {
    expect(readContext({ otherLocales: OTHER_LOCALES, urlSuffix: '' })).toEqual(
      {
        otherLocales: OTHER_LOCALES,
        defaultLocaleSlug: null,
        urlSuffix: '',
      }
    )
  })

  it('returns null outside a provider, so the selector falls back to path rewriting', () => {
    expect(renderHook(() => useLocalizedProduct()).result.current).toBeNull()
  })
})
