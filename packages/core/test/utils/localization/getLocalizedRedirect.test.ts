import { describe, expect, it } from 'vitest'
import { localizeRedirectResult } from '../../../src/utils/localization/getLocalizedRedirect'

describe('localizeRedirectResult', () => {
  it('returns props unchanged', () => {
    expect(
      localizeRedirectResult(
        { locale: 'pt-BR', defaultLocale: 'en-US' },
        { props: { foo: 'bar' } }
      )
    ).toEqual({ props: { foo: 'bar' } })
  })

  it('does not set locale for default locale redirects', () => {
    expect(
      localizeRedirectResult(
        { locale: 'en-US', defaultLocale: 'en-US' },
        {
          redirect: {
            destination: '/pvt/account/403?from=%2Fpvt%2Faccount%2Fprofile',
            permanent: false,
          },
        }
      )
    ).toEqual({
      redirect: {
        destination: '/pvt/account/403?from=%2Fpvt%2Faccount%2Fprofile',
        permanent: false,
      },
    })
  })

  it('sets locale on internal redirects for non-default locale', () => {
    expect(
      localizeRedirectResult(
        { locale: 'pt-BR', defaultLocale: 'en-US' },
        {
          redirect: {
            destination: '/pvt/account/403?from=%2Fpvt%2Faccount%2Fprofile',
            permanent: false,
          },
        }
      )
    ).toEqual({
      redirect: {
        destination: '/pvt/account/403?from=%2Fpvt%2Faccount%2Fprofile',
        permanent: false,
        locale: 'pt-BR',
      },
    })
  })

  it('does not modify external redirects', () => {
    const external = {
      redirect: {
        destination: 'https://account.example.com/login',
        permanent: false,
      },
    }

    expect(
      localizeRedirectResult(
        { locale: 'pt-BR', defaultLocale: 'en-US' },
        external
      )
    ).toEqual(external)
  })

  it('does not override an existing redirect locale', () => {
    expect(
      localizeRedirectResult(
        { locale: 'pt-BR', defaultLocale: 'en-US' },
        {
          redirect: {
            destination: '/pvt/account/profile',
            permanent: false,
            locale: false,
          },
        }
      )
    ).toEqual({
      redirect: {
        destination: '/pvt/account/profile',
        permanent: false,
        locale: false,
      },
    })
  })
})
