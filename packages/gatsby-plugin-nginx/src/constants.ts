export const BUILD_HTML_STAGE = 'build-html'

export const INDEX_HTML = 'index.html'

export const IMMUTABLE_CACHING_HEADER = {
  name: 'Cache-Control',
  value: 'public, max-age=31536000, immutable',
}

export const PUBLIC_CACHING_HEADER = {
  name: 'Cache-Control',
  value: 'public, max-age=0, must-revalidate',
}

export const COMMON_BUNDLES = ['commons', 'app']

export const PAGE_DATA_DIR = 'page-data'

export const CACHING_HEADERS = [
  ['/sw.js', [{ name: 'Cache-Control', value: 'no-cache' }]],
]

export const VTEX_NGINX_CONF_FILENAME = 'nginx.conf'

export const LOCATIONS_ONLY_ENV_VAR = 'NGINX_LOCATIONS_ONLY'

export const FILE_SERVE_DIRECTIVE_ENV_VAR = 'NGINX_SERVE_FILE_DIRECTIVE'

export const ENABLE_BROTLI_ENV_VAR = 'NGINX_BROTLI'
