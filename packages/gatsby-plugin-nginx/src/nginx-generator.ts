import { posix } from 'path'

import { INDEX_HTML, LOCATION_MODIFIERS } from './constants'
import { getGlobalHeaders, normalizePath } from './headers'
import { identity } from './utils/functions'

export {
  stringify,
  parseRewrite,
  generateRewrites,
  generatePathLocation,
  generateNginxConfiguration,
}

function generateNginxConfiguration({
  rewrites,
  headersMap,
  files,
  options,
}: {
  rewrites: Redirect[]
  headersMap: PathHeadersMap
  files: string[]
  options: PluginOptions
}): string {
  const {
    disableBrotliEncoding,
    writeOnlyLocations,
    serverOptions,
    httpOptions,
    locations: {
      append: appendLocations = [],
      prepend: prependLocations = [],
    } = {},
    customGlobalHeaders,
  } = options

  const globalHeaderDirectives = getGlobalHeaders(customGlobalHeaders)

  const filesSet = new Set(files)
  const locations = [
    // Block nginx.conf
    {
      cmd: ['location', '/nginx.conf'],
      children: [{ cmd: ['deny', 'all'] }, { cmd: ['return', '404'] }],
    },
    // Remove trailing slash if present
    {
      cmd: ['location', '~', '^(?<no_slash>.+)/$'],
      children: [{ cmd: ['rewrite', '.+', '$no_slash'] }],
    },
    ...prependLocations,
    ...Object.entries(headersMap)
      .map(([path, headers]) =>
        generatePathLocation({ path, headers, files: filesSet, options })
      )
      .filter<NginxDirective>(
        (value: NginxDirective | undefined): value is NginxDirective => {
          return value !== undefined
        }
      ),
    ...generateRewrites(rewrites),
    ...appendLocations,
  ].map((location) => addGlobalHeaders(location, globalHeaderDirectives))

  const brotliConf = disableBrotliEncoding
    ? []
    : [
        { cmd: ['brotli', 'on'] },
        { cmd: ['brotli_comp_level', '6'] },
        { cmd: ['brotli_static', 'on'] },
        {
          cmd: [
            'brotli_types',
            'text/xml',
            'image/svg+xml',
            'application/x-font-ttf',
            'image/vnd.microsoft.icon',
            'application/x-font-opentype',
            'application/json',
            'font/eot',
            'application/vnd.ms-fontobject',
            'application/javascript',
            'font/otf',
            'application/xml',
            'application/xhtml+xml',
            'text/javascript',
            'application/x-javascript',
            'text/plain',
            'application/x-font-truetype',
            'application/xml+rss',
            'image/x-icon',
            'font/opentype',
            'text/css',
            'image/x-win-bitmap',
          ],
        },
      ]

  const conf = writeOnlyLocations
    ? locations
    : [
        { cmd: ['worker_processes', '3'] },
        { cmd: ['worker_rlimit_nofile', '8192'] },
        { cmd: ['error_log', '/var/log/nginx/error.log', 'debug'] },
        { cmd: ['pid', '/var/log/nginx_run.pid'] },
        {
          cmd: ['events'],
          children: [{ cmd: ['worker_connections', '1024'] }],
        },
        {
          cmd: ['http'],
          children: [
            ...httpOptions.map((cmd) => ({ cmd })),
            // $use_url_tmp = $host OR $http_origin
            {
              cmd: ['map', '$host', '$use_url_tmp'],
              children: [
                { cmd: ['default', '$http_origin'] },
                { cmd: ['~^(?<all>.*)$', '$all'] },
              ],
            },
            // $use_url = $http_x_forwarded_host OR $use_url_tmp
            {
              cmd: ['map', '$http_x_forwarded_host', '$use_url'],
              children: [
                { cmd: ['default', '$use_url_tmp'] },
                { cmd: ['~^(?<all>.*)$', '$all'] },
              ],
            },
            // $origin_host = remove_protocol($use_url)
            {
              cmd: ['map', '$use_url', '$origin_host'],
              children: [
                { cmd: ['default', '$use_url'] },
                { cmd: ['~^https?://(?<all>.*)/?.*$', '$all'] },
              ],
            },
            {
              cmd: [
                'log_format',
                'json_combined',
                'escape=json',
                '\'{ "time_local":"$time_local", "remote_addr":"$remote_addr", "remote_user":"$remote_user", "request":"$request", "status": "$status", "body_bytes_sent":"$body_bytes_sent", "request_time":"$request_time", "http_referrer":"$http_referer", "http_user_agent":"$http_user_agent" }\'',
              ],
            },
            {
              cmd: ['access_log', '/var/log/nginx/access.log', 'json_combined'],
            },
            { cmd: ['include', '/etc/nginx/mime.types'] },
            { cmd: ['default_type', 'application/octet-stream'] },
            { cmd: ['disable_symlinks', 'off'] },
            { cmd: ['sendfile', 'on'] },
            { cmd: ['tcp_nopush', 'on'] },
            { cmd: ['keepalive_timeout', '65'] },
            ...brotliConf,
            { cmd: ['gzip', 'on'] },
            {
              cmd: [
                'gzip_types',
                'text/plain',
                'text/css',
                'text/xml',
                'application/javascript',
                'application/x-javascript',
                'application/xml',
                'application/xml+rss',
                'application/emacscript',
                'application/json',
                'image/svg+xml',
              ],
            },
            {
              cmd: ['server'],
              children: [
                ...serverOptions.map((cmd) => ({ cmd })),
                { cmd: ['listen', '0.0.0.0:$PORT', 'default_server'] },
                { cmd: ['large_client_header_buffers', '4', '32k'] },
                // https://www.gatsbyjs.com/docs/how-to/adding-common-features/add-404-page/
                { cmd: ['error_page', '404', '/404.html'] },

                ...locations,
              ],
            },
          ],
        },
      ]

  return stringify(conf)
}

function stringify(directives: NginxDirective[]): string {
  return directives
    .map(
      ({ cmd, children }) =>
        `${cmd.join(' ')}${
          children ? ` {\n${ident(stringify(children))}\n}` : ';'
        }`
    )
    .join('\n')
}

const wildcard = /\*/g
const namedSegment = /:[^/]+/g
const catchAll = '/(.*)'

// Converts a gatsby path to nginx location path
// Ex:
//  '/:p1/:p2/foo/*' => '^/([^/]+)/([^/]+)/foo/(.*)$'
//  '/:splat' => '^/([^/]+)$'
//  '/foo/bar/:splat' => '^/foo/bar/([^/]+)$'
export function convertToRegExp(path: string) {
  let converted = path
    .replace(wildcard, '(.*)') // replace * with (.*)
    .replace(namedSegment, '([^/]+)') // replace :param like with url component like regex ([^/]+)

  if (converted.endsWith(catchAll) && converted.length > catchAll.length) {
    // allows '<path>/*' to serve '<path>' (without trailing slash)
    // this is necessary because we are now removing trailing slashes from incoming requests
    // so exact matches can work when there is a trailing slash
    converted = `${converted.slice(0, -catchAll.length)}(?:/(.*))?`
  }

  const noTrailingSlashes = normalizePath(converted)

  return `^${noTrailingSlashes}$`
}

function isRegExpMatch(path: string) {
  return wildcard.test(path) || namedSegment.test(path)
}

// Converts a gatsby path to nginx proxy_pass path
// Ex:
//  '/:p1/:p2/foo/*' => /$1/$2/foo/$3
//  '/:splat' => '/$1'
//  '/foo/bar/:splat' => '/foo/bar/$1'
function convertToPath(path: string) {
  let it = 0

  return path.replace(
    new RegExp(`${wildcard.source}|${namedSegment.source}`, 'g'),
    (match) => {
      const isMatchANumber = !Number.isNaN(parseInt(match.substr(1), 10))
      const isMatchAPortNumber = it === 0 && isMatchANumber

      if (isMatchAPortNumber) {
        return match
      }

      it += 1

      return `$${it}`
    }
  )
}

function parseRewrite({
  toPath,
  statusCode = 200,
  isPermanent,
}: Redirect): NginxRewriteType {
  try {
    new URL(toPath)

    return 'proxy'
  } catch (ex) {
    // This wasn't a proxy url. Let's check if this is an internal redirect
    // a.k.a from `/foo` to `/bar`
  }

  try {
    // Parse as an internal redirect, a.k.a /foo to /bar
    new URL(toPath, 'http://example.org')

    return statusCode === 200
      ? 'rewrite'
      : statusCode === 301 || statusCode === 302 || isPermanent
      ? 'redirect'
      : 'error_page'
  } catch (e) {
    throw new Error(`redirect toPath "${toPath}" must be a valid absolute URL`)
  }
}

function formatProxyHeaders(headers: Record<string, string> | undefined) {
  return Object.keys(headers ?? {}).map((name) => {
    return { cmd: ['proxy_set_header', name, headers![name]] }
  })
}

function generateProxyRewriteChildren({
  toPath,
  proxyHeaders,
}: Redirect): NginxDirective['children'] {
  return [
    ...formatProxyHeaders(proxyHeaders as Record<string, string> | undefined),
    { cmd: ['proxy_pass', `${convertToPath(toPath)}$is_args$args`] },
    { cmd: ['proxy_ssl_server_name', 'on'] },
  ]
}

function generateErrorPageRewriteChildren({
  toPath,
  statusCode = 200,
}: Redirect): NginxDirective['children'] {
  return [
    {
      cmd: ['error_page', statusCode.toString(), toPath],
    },
    {
      cmd: ['return', statusCode.toString()],
    },
  ]
}

function generateRewriteChildren({ toPath }: Redirect) {
  return [
    {
      cmd: ['rewrite', '.+', toPath.replace(/\/$/g, '')],
    },
  ]
}

function generateRedirectRewriteChildren({
  toPath,
  isPermanent,
  statusCode = 301,
}: Redirect) {
  const status = isPermanent ? 301 : statusCode

  return [
    {
      cmd: ['absolute_redirect', 'off'],
    },
    {
      cmd: ['return', `${status}`, `"${toPath}"`],
    },
  ]
}

function generateRewrites(rewrites: Redirect[]): NginxDirective[] {
  const childrenByType = {
    rewrite: generateRewriteChildren,
    proxy: generateProxyRewriteChildren,
    error_page: generateErrorPageRewriteChildren,
    redirect: generateRedirectRewriteChildren,
  }

  return rewrites.map((rewrite) => {
    const { fromPath } = rewrite
    const type = parseRewrite(rewrite)
    const onGenerateNginxRewrites = rewrite.onGenerateNginxRewrites ?? identity

    /**
     * https://www.getpagespeed.com/server-setup/nginx-locations-performance-impact-and-optimizations
     * According to the source above and my sense as programmer, it's better to use EXACT_MATCH than
     * any form of RegExp for performance reasons.
     *
     * With this in mind, let's use RegExp only where it's necessary
     */
    const shouldUseRegex = isRegExpMatch(fromPath)

    const modifier = shouldUseRegex
      ? LOCATION_MODIFIERS.CASE_INSENSITIVE_REGEX_MATCH
      : LOCATION_MODIFIERS.EXACT_MATCH

    const match =
      modifier === LOCATION_MODIFIERS.EXACT_MATCH
        ? fromPath
        : convertToRegExp(fromPath)

    const children = childrenByType[type](rewrite)

    return {
      cmd: ['location', modifier, `"${match}"`],
      children: children && onGenerateNginxRewrites(children, type),
    }
  })
}

function storagePassTemplate(
  path: string,
  files: Set<string>,
  { serveFileDirective }: PluginOptions
): NginxDirective | undefined {
  path = path.slice(1) // remove leading slash

  const pathIndex = posix.join(path, INDEX_HTML)
  const filePath = files.has(pathIndex)
    ? pathIndex
    : files.has(path)
    ? path
    : undefined

  if (filePath === undefined) {
    return undefined
  }

  return {
    cmd: serveFileDirective.map((part) => part.replace(/\$file/g, filePath)),
  }
}

function generatePathLocation({
  path,
  headers,
  files,
  options,
}: {
  path: string
  headers: Header[]
  files: Set<string>
  options: PluginOptions
}): NginxDirective | undefined {
  const proxyPassDirective = storagePassTemplate(path, files, options)

  // Enforce returning 404 status code for /404 page
  const returnDirective = path === '/404' ? [{ cmd: ['return', '404'] }] : []

  if (proxyPassDirective === undefined) {
    return undefined
  }

  return {
    cmd: ['location', '=', path],
    children: [
      ...headers.map(addHeaderDirective),
      proxyPassDirective,
      ...returnDirective,
    ],
  }
}

export function addHeaderDirective({ name, value }: Header) {
  return {
    cmd: ['add_header', name, `"${value}"`],
  }
}

export function addGlobalHeaders(
  location: NginxDirective,
  globalHeadersDirectives: NginxDirective[]
) {
  return {
    ...location,
    children: [...(location.children ?? []), ...globalHeadersDirectives],
  }
}

function ident(text: string, space = '  ') {
  return text
    .split('\n')
    .map((line) => `${space}${line}`)
    .join('\n')
}
