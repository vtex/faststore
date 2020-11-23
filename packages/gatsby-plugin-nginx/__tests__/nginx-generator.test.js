const {
  stringify,
  convertFromPath,
  validateRedirect,
  generateRewrites,
  generateRedirects,
} = require('../nginx-generator.js')

describe('stringify', () => {
  it('correctly stringifies nginx directives', () => {
    expect(
      stringify([
        { cmd: ['worker_processes', '3'] },
        {
          cmd: ['http'],
          children: [
            {
              cmd: ['server'],
              children: [
                {
                  cmd: ['location', '=', '/blouse/p'],
                  children: [
                    { cmd: ['add_header', 'x-frame-options', '"DENY"'] },
                  ],
                },
              ],
            },
          ],
        },
      ])
    ).toEqual(`worker_processes 3;
http {
  server {
    location = /blouse/p {
      add_header x-frame-options "DENY";
    }
  }
}`)
  })
})

describe('convertFromPath', () => {
  it('handles :slug', () => {
    expect(convertFromPath('/:slug/p')).toEqual('^/[^/]+/p')
    expect(convertFromPath('/:slug')).toEqual('^/[^/]+')
    expect(convertFromPath('/pt/:slug/p')).toEqual('^/pt/[^/]+/p')
  })

  it('handles wildcard (*)', () => {
    expect(convertFromPath('/*')).toEqual('^/.*')
    expect(convertFromPath('/pt/*')).toEqual('^/pt/.*')
  })
})

describe('validateRedirect', () => {
  it('throws when toPath is not an absolute URL', () => {
    const cases = [
      ['/api/*', '/api/:splat'],
      ['/api/*', 'www.example.com'],
    ]
    cases.forEach(([fromPath, toPath]) =>
      expect(() => validateRedirect({ fromPath, toPath })).toThrow(
        `redirect toPath "${toPath}" must be a valid absolute URL`
      )
    )
  })

  it('throws if paths do not match', () => {
    expect(() =>
      validateRedirect({
        fromPath: '/api/*',
        toPath:
          'https://storecomponents.vtexcommercestable.com.br/api/v2/:splat',
      })
    ).toThrow(
      'redirect toPath "https://storecomponents.vtexcommercestable.com.br/api/v2/:splat" fromPath "/api/*": paths must match'
    )
  })

  it('accepts matching paths with absolute toPath', () => {
    expect(
      validateRedirect({
        fromPath: '/api/*',
        toPath: 'https://storecomponents.vtexcommercestable.com.br/api/:splat',
      })
    ).toEqual(true)
  })
})

describe('generateRewrites', () => {
  it('correctly translates into NginxDirectives', () => {
    const expected = {
      cmd: ['location', '@clientSideFallback'],
      children: [
        { cmd: ['rewrite', '^/[^/]+/p', '/__client-side-product__/p', 'last'] },
        {
          cmd: [
            'rewrite',
            '^/pt/[^/]+/p',
            '/pt/__client-side-product__/p',
            'last',
          ],
        },
        { cmd: ['rewrite', '^/.*', '/__client-side-search__', 'last'] },
        { cmd: ['rewrite', '^/pt/.*', '/pt/__client-side-search__', 'last'] },
        { cmd: ['return', '404'] },
      ],
    }
    expect(
      generateRewrites([
        { fromPath: '/:slug/p', toPath: '/__client-side-product__/p' },
        { fromPath: '/pt/:slug/p', toPath: '/pt/__client-side-product__/p' },
        { fromPath: '/*', toPath: '/__client-side-search__' },
        { fromPath: '/pt/*', toPath: '/pt/__client-side-search__' },
      ])
    ).toEqual(expected)
  })
})

describe('generateRedirects', () => {
  it('correctly translates into NginxDirectives', () => {
    const expected = [
      {
        cmd: ['location', '~*', '^/api/.*'],
        children: [
          {
            cmd: [
              'proxy_pass',
              'https://storecomponents.vtexcommercestable.com.br$uri$is_args$args',
            ],
          },
          { cmd: ['proxy_ssl_server_name', 'on'] },
        ],
      },
      {
        cmd: ['location', '~*', '^/graphql/.*'],
        children: [
          {
            cmd: [
              'proxy_pass',
              'https://master--storecomponents.myvtex.com$uri$is_args$args',
            ],
          },
          { cmd: ['proxy_ssl_server_name', 'on'] },
        ],
      },
    ]
    expect(
      generateRedirects([
        {
          fromPath: '/api/*',
          isPermanent: false,
          redirectInBrowser: false,
          toPath:
            'https://storecomponents.vtexcommercestable.com.br/api/:splat',
          statusCode: 200,
        },
        {
          fromPath: '/graphql/*',
          isPermanent: false,
          redirectInBrowser: false,
          toPath: 'https://master--storecomponents.myvtex.com/graphql/:splat',
          statusCode: 200,
        },
      ])
    ).toEqual(expected)
  })
})
