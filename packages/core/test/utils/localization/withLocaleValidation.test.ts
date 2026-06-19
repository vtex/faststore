import { describe, expect, it, vi } from 'vitest'
import type { GetServerSidePropsContext } from 'next'
import { withLocaleValidationSSR } from '../../../src/utils/localization/withLocaleValidation'

vi.mock('../../../discovery.config.js', () => ({
  default: {
    localization: {
      enabled: true,
      defaultLocale: 'en-US',
      locales: {
        'pt-BR': {
          bindings: [{ url: 'https://b2bfaststore.vtexfaststore.com/pt-BR' }],
        },
        'en-US': {
          bindings: [{ url: 'https://b2bfaststore.vtexfaststore.com/' }],
        },
      },
    },
  },
}))

function buildContext({
  locale,
  reqUrl,
  resolvedUrl,
  host,
}: {
  locale: string
  reqUrl: string
  resolvedUrl: string
  host: string
}): GetServerSidePropsContext {
  return {
    locale,
    resolvedUrl,
    req: {
      url: reqUrl,
      headers: { host },
    },
  } as GetServerSidePropsContext
}

describe('withLocaleValidationSSR — /pvt/ routes with locale prefix', () => {
  it('skips validation for /pvt/ when resolvedUrl has no locale prefix', async () => {
    const innerFn = vi.fn().mockResolvedValue({ props: {} })
    const wrapped = withLocaleValidationSSR(innerFn)

    await wrapped(
      buildContext({
        locale: 'en-US',
        reqUrl: '/pvt/account/profile',
        resolvedUrl: '/pvt/account/profile',
        host: 'wrong-internal-host.vtex.com',
      })
    )

    expect(innerFn).toHaveBeenCalledOnce()
  })

  it('skips validation for pt-BR /pvt/ even when req.url includes locale prefix', async () => {
    const innerFn = vi.fn().mockResolvedValue({ props: {} })
    const wrapped = withLocaleValidationSSR(innerFn)

    await wrapped(
      buildContext({
        locale: 'pt-BR',
        reqUrl: '/pt-BR/pvt/account/profile',
        resolvedUrl: '/pvt/account/profile',
        host: 'wrong-internal-host.vtex.com',
      })
    )

    expect(innerFn).toHaveBeenCalledOnce()
  })

  it('returns notFound for non-/pvt/ routes with invalid hostname', async () => {
    const innerFn = vi.fn().mockResolvedValue({ props: {} })
    const wrapped = withLocaleValidationSSR(innerFn)

    const result = await wrapped(
      buildContext({
        locale: 'pt-BR',
        reqUrl: '/pt-BR/office',
        resolvedUrl: '/office',
        host: 'wrong-internal-host.vtex.com',
      })
    )

    expect(result).toEqual({ notFound: true })
    expect(innerFn).not.toHaveBeenCalled()
  })

  it('adds redirect.locale for /pvt/ internal redirects on non-default locale', async () => {
    const innerFn = vi.fn().mockResolvedValue({
      redirect: {
        destination: '/pvt/account/403?from=%2Fpvt%2Faccount%2Fprofile',
        permanent: false,
      },
    })
    const wrapped = withLocaleValidationSSR(innerFn)

    const result = await wrapped(
      buildContext({
        locale: 'pt-BR',
        defaultLocale: 'en-US',
        reqUrl: '/pt-BR/pvt/account/profile',
        resolvedUrl: '/pvt/account/profile',
        host: 'b2bfaststore.vtexfaststore.com',
      } as GetServerSidePropsContext)
    )

    expect(result).toEqual({
      redirect: {
        destination: '/pvt/account/403?from=%2Fpvt%2Faccount%2Fprofile',
        permanent: false,
        locale: 'pt-BR',
      },
    })
  })
})
