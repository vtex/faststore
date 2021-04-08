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

export const DISABLE_BROTLI_ENV_VAR = 'NGINX_DISABLE_BROTLI'

export const LOCATION_MODIFIERS = {
  EXACT_MATCH: '=', // this block will be cons idered a match if the request URI exactly matches the location given.
  CASE_SENSITIVE_REGEX_MATCH: '~', // this location will be interpreted as a case-sensitive regular expression match.
  CASE_INSENSITIVE_REGEX_MATCH: '~*', // the location block will be interpreted as a case-insensitive regular expression match.
  BEST_NON_REGEX_MATCH: '^~', // if this block is selected as the best non-regular expression match, regular expression matching will not take place.
}

export const FUNCTIONS_REDIRECTS_FILENAME = 'functions-redirects.json'

export const FUNCTIONS_URL_PATH = 'functions'
