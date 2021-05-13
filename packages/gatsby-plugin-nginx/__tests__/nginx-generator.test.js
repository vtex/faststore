const {
  stringify,
  convertToRegExp,
  parseRewrite,
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

describe('convert Gatsby paths into nginx RegExp', () => {
  it('handles :slug', () => {
    expect(convertToRegExp('/:slug/p')).toEqual('^/[^/]+/p$')
    expect(convertToRegExp('/:slug')).toEqual('^/[^/]+$')
    expect(convertToRegExp('/pt/:slug/p')).toEqual('^/pt/[^/]+/p$')
  })

  it('handles wildcard (*)', () => {
    expect(convertToRegExp('/*')).toEqual('^/(.*)$')
    expect(convertToRegExp('/pt/*')).toEqual('^/pt/(.*)$')
  })
})

describe('parseRewrite', () => {
  it('Correctly parse rewrite cases', () => {
    expect(parseRewrite({ toPath: '/api/:splat' })).toBe('rewrite')
    expect(parseRewrite({ toPath: 'www.example.com' })).toBe('rewrite')
    expect(parseRewrite({ toPath: 'https://www.example.com' })).toBe('proxy')
    expect(
      parseRewrite({ toPath: 'https://www.example.com', statusCode: 301 })
    ).toBe('proxy')
    expect(parseRewrite({ toPath: '/foo', statusCode: 301 })).toBe('redirect')
    expect(parseRewrite({ toPath: '/foo', statusCode: 404 })).toBe('error_page')
  })
})

describe('generateRewrites', () => {
  it('correctly translates into NginxDirectives', () => {
    const expected = [
      {
        children: [
          {
            cmd: ['rewrite', '.+', '/__client-side-product__/p'],
          },
        ],
        cmd: ['location', '~*', '"^/[^/]+/p$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/pt/__client-side-product__/p'] }],
        cmd: ['location', '~*', '"^/pt/[^/]+/p$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/__client-side-search__'] }],
        cmd: ['location', '~*', '"^/(.*)$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/pt/__client-side-search__'] }],
        cmd: ['location', '~*', '"^/pt/(.*)$"'],
      },
    ]
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
        cmd: ['location', '~*', '"^/api/(.*)$"'],
        children: [
          {
            cmd: [
              'proxy_pass',
              'https://storecomponents.vtexcommercestable.com.br/api/$1$is_args$args',
            ],
          },
          { cmd: ['proxy_ssl_server_name', 'on'] },
        ],
      },
      {
        cmd: ['location', '~*', '"^/graphql/(.*)$"'],
        children: [
          {
            cmd: [
              'proxy_pass',
              'https://master--storecomponents.myvtex.com/graphql/$1$is_args$args',
            ],
          },
          { cmd: ['proxy_ssl_server_name', 'on'] },
        ],
      },
    ]

    expect(
      generateRewrites([
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
