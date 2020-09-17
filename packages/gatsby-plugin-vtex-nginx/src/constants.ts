export const BUILD_HTML_STAGE = 'build-html'

export const IMMUTABLE_CACHING_HEADER = {
  name: 'Cache-Control',
  value: 'public, max-age=31536000, immutable',
}

export const COMMON_BUNDLES = ['commons', 'app']

export const PAGE_DATA_DIR = 'page-data'

export const CACHING_HEADERS = [
  ['/static/*', [IMMUTABLE_CACHING_HEADER]],
  ['/sw.js', [{ name: 'Cache-Control', value: 'no-cache' }]],
]

export const VTEX_NGINX_CONF_FILENAME = 'nginx.conf'
