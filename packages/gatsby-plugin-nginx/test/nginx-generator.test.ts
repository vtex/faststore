import {
  stringify,
  convertToRegExp,
  parseRewrite,
  generateRewrites,
  generateNginxConfiguration,
} from '../src/nginx-generator'

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
    ).toMatchInlineSnapshot(`
      "worker_processes 3;
      http {
        server {
          location = /blouse/p {
            add_header x-frame-options \\"DENY\\";
          }
        }
      }"
    `)
  })
})

describe('convert Gatsby paths into nginx RegExp', () => {
  it('handles :slug', () => {
    expect(convertToRegExp('/:slug/p')).toEqual('^/([^/]+)/p$')
    expect(convertToRegExp('/:slug')).toEqual('^/([^/]+)$')
    expect(convertToRegExp('/pt/:slug/p')).toEqual('^/pt/([^/]+)/p$')
  })

  it('handles multiple params', () => {
    expect(convertToRegExp('/:p1/:p2/p')).toEqual('^/([^/]+)/([^/]+)/p$')
    expect(convertToRegExp('/base/:p1/:p2')).toEqual('^/base/([^/]+)/([^/]+)$')
    expect(convertToRegExp('/:p1/foo/:p2')).toEqual('^/([^/]+)/foo/([^/]+)$')
  })

  it('handles wildcard (*)', () => {
    expect(convertToRegExp('/*')).toEqual('^/(.*)$')
    expect(convertToRegExp('/*/')).toEqual('^/(.*)$')
    expect(convertToRegExp('/pt/*')).toEqual('^/pt/(.*)$')
  })
})

describe('parseRewrite', () => {
  it('Correctly parse rewrite cases', () => {
    expect(parseRewrite({ fromPath: '', toPath: '/api/:splat' })).toBe(
      'rewrite'
    )
    expect(parseRewrite({ fromPath: '', toPath: 'www.example.com' })).toBe(
      'rewrite'
    )
    expect(
      parseRewrite({ fromPath: '', toPath: 'https://www.example.com' })
    ).toBe('proxy')
    expect(
      parseRewrite({
        fromPath: '',
        toPath: 'https://www.example.com',
        statusCode: 301,
      })
    ).toBe('proxy')
    expect(
      parseRewrite({ fromPath: '', toPath: '/foo', statusCode: 301 })
    ).toBe('redirect')
    expect(
      parseRewrite({ fromPath: '', toPath: '/foo', statusCode: 404 })
    ).toBe('error_page')
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
        cmd: ['location', '~*', '"^/([^/]+)/p$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/pt/__client-side-product__/p'] }],
        cmd: ['location', '~*', '"^/pt/([^/]+)/p$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/__client-side-search__'] }],
        cmd: ['location', '~*', '"^/(.*)$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/pt/__client-side-search__'] }],
        cmd: ['location', '~*', '"^/pt/(.*)$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/foo-path'] }],
        cmd: ['location', '~*', '"^/([^/]+)/([^/]+)/foo$"'],
      },
      {
        children: [{ cmd: ['rewrite', '.+', '/bar-path'] }],
        cmd: ['location', '~*', '"^/([^/]+)/bar/([^/]+)$"'],
      },
    ]

    expect(
      generateRewrites([
        { fromPath: '/:slug/p', toPath: '/__client-side-product__/p' },
        { fromPath: '/pt/:slug/p', toPath: '/pt/__client-side-product__/p' },
        { fromPath: '/*', toPath: '/__client-side-search__' },
        { fromPath: '/pt/*', toPath: '/pt/__client-side-search__' },
        { fromPath: '/:p1/:p2/foo', toPath: '/foo-path' },
        { fromPath: '/:p1/bar/:p2', toPath: '/bar-path' },
      ])
    ).toEqual(expected)
  })

  it('uses onGenerateNginxRewrites to augment the children commands', () => {
    const expected = [
      {
        children: [
          {
            cmd: [
              'proxy_pass',
              'https://other-domain.com/api/auth/$1$is_args$args',
            ],
          },
          { cmd: ['proxy_ssl_server_name', 'on'] },
          { cmd: ['proxy_cookie_domain', 'other-domain.com', '$host'] },
          { cmd: ['proxy_cookie_path', '/api/auth', '/'] },
        ],
        cmd: ['location', '~*', '"^/api/auth/(.*)$"'],
      },
    ]

    expect(
      generateRewrites([
        {
          fromPath: '/api/auth/*',
          toPath: 'https://other-domain.com/api/auth/:splat',
          onGenerateNginxRewrites: (commands) => {
            return [
              ...commands,
              { cmd: ['proxy_cookie_domain', 'other-domain.com', '$host'] },
              { cmd: ['proxy_cookie_path', '/api/auth', '/'] },
            ]
          },
        },
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
      {
        cmd: ['location', '=', '"/logs"'],
        children: [
          {
            cmd: [
              'proxy_pass',
              'https://mylogs-proxy.endpoint.com:8088/logs$is_args$args',
            ],
          },
          {
            cmd: ['proxy_ssl_server_name', 'on'],
          },
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
        {
          fromPath: '/logs',
          isPermanent: false,
          redirectInBrowser: false,
          toPath: 'https://mylogs-proxy.endpoint.com:8088/logs',
          statusCode: 200,
        },
      ])
    ).toEqual(expected)
  })
})

describe('generateNginxConfiguration', () => {
  it('correctly generates basic nginx configuration', () => {
    const rewrites: Redirect[] = []

    const headersMap: PathHeadersMap = {
      '/foo': [{ name: `a`, value: `b` }],
      '/bar': [{ name: `a`, value: `b` }],
    }

    const files: string[] = [`foo/index.html`, `bar/index.html`]
    const options: PluginOptions = {
      plugins: [],
      disableBrotliEncoding: false,
      serveFileDirective: ['try_files', '/$file', '=404'],
      transformHeaders: undefined,
      writeOnlyLocations: false,
      serverOptions: [],
      httpOptions: [],
    }

    expect(
      generateNginxConfiguration({
        rewrites,
        headersMap,
        files,
        options,
      })
    ).toMatchInlineSnapshot(`
      "worker_processes 3;
      worker_rlimit_nofile 8192;
      error_log /var/log/nginx/error.log debug;
      pid /var/log/nginx_run.pid;
      events {
        worker_connections 1024;
      }
      http {
        map $host $use_url_tmp {
          default $http_origin;
          ~^(?<all>.*)$ $all;
        }
        map $http_x_forwarded_host $use_url {
          default $use_url_tmp;
          ~^(?<all>.*)$ $all;
        }
        map $use_url $origin_host {
          default $use_url;
          ~^https?://(?<all>.*)/?.*$ $all;
        }
        log_format json_combined escape=json '{ \\"time_local\\":\\"$time_local\\", \\"remote_addr\\":\\"$remote_addr\\", \\"remote_user\\":\\"$remote_user\\", \\"request\\":\\"$request\\", \\"status\\": \\"$status\\", \\"body_bytes_sent\\":\\"$body_bytes_sent\\", \\"request_time\\":\\"$request_time\\", \\"http_referrer\\":\\"$http_referer\\", \\"http_user_agent\\":\\"$http_user_agent\\" }';
        access_log /var/log/nginx/access.log json_combined;
        include /etc/nginx/mime.types;
        default_type application/octet-stream;
        disable_symlinks off;
        sendfile on;
        tcp_nopush on;
        keepalive_timeout 65;
        brotli on;
        brotli_comp_level 6;
        brotli_static on;
        brotli_types text/xml image/svg+xml application/x-font-ttf image/vnd.microsoft.icon application/x-font-opentype application/json font/eot application/vnd.ms-fontobject application/javascript font/otf application/xml application/xhtml+xml text/javascript application/x-javascript text/plain application/x-font-truetype application/xml+rss image/x-icon font/opentype text/css image/x-win-bitmap;
        gzip on;
        gzip_types text/plain text/css text/xml application/javascript application/x-javascript application/xml application/xml+rss application/emacscript application/json image/svg+xml;
        server {
          listen 0.0.0.0:$PORT default_server;
          error_page 404 /404.html;
          location /nginx.conf {
            deny all;
            return 404;
          }
          location = /foo {
            add_header a \\"b\\";
            try_files /foo/index.html =404;
          }
          location = /bar {
            add_header a \\"b\\";
            try_files /bar/index.html =404;
          }
          location / {
            add_header Cache-Control \\"public, max-age=0, must-revalidate\\";
            try_files $uri $uri/ $uri/index.html $uri.html =404;
          }
        }
      }"
    `)
  })

  it('quickly generates large nginx configuration', () => {
    function generateLargeConfig(numFiles: number) {
      const headersMap: PathHeadersMap = {}
      const files: string[] = []

      for (let i = 0; i < numFiles; i++) {
        headersMap[`/page-${i}`] = [{ name: `a`, value: `b` }]
        files.push(`page-${i}/index.html`)
      }

      return {
        headersMap,
        files,
      }
    }

    const rewrites: Redirect[] = []

    const { headersMap, files } = generateLargeConfig(10000)
    const options: PluginOptions = {
      plugins: [],
      disableBrotliEncoding: false,
      serveFileDirective: ['try_files', '/$file', '=404'],
      transformHeaders: (headers) =>
        headers
          .filter((h) => !h.includes(`Cache-Control`))
          .concat(`Cache-Control: public`),
      writeOnlyLocations: false,
      serverOptions: [],
      httpOptions: [],
    }

    const start = performance.now()

    generateNginxConfiguration({
      rewrites,
      headersMap,
      files,
      options,
    })

    expect(performance.now() - start).toBeLessThan(1000) // on my macbook pro this was 25759.70454ms before perf fix was applied
  })
})
