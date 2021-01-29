import { posix } from 'path'

import { INDEX_HTML } from './constants'

export {
  stringify,
  convertFromPath,
  parseRewrite,
  generateRewrites,
  generatePathLocation,
  generateNginxConfiguration,
}

export interface NginxDirective {
  cmd: string[]
  children?: NginxDirective[]
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
  const locations = [
    ...Object.entries(headersMap)
      .map(([path, headers]) =>
        generatePathLocation({ path, headers, files, options })
      )
      .filter<NginxDirective>(
        (value: NginxDirective | undefined): value is NginxDirective => {
          return value !== undefined
        }
      ),
    ...generateRewrites(rewrites),
  ]

  const brotliConf = options.disableBrotliEncoding
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

  const conf = options.writeOnlyLocations
    ? locations
    : [
        { cmd: ['worker_processes', '3'] },
        { cmd: ['worker_rlimit_nofile', '8192'] },
        { cmd: ['error_log', '/var/log/nginx_errors.log', 'debug'] },
        { cmd: ['pid', '/var/log/nginx_run.pid'] },
        {
          cmd: ['events'],
          children: [{ cmd: ['worker_connections', '1024'] }],
        },
        {
          cmd: ['http'],
          children: [
            {
              cmd: ['map', '$http_origin', '$origin'],
              children: [
                { cmd: ['~^https?://(<hostname>.*)/?.*$', '$hostname'] },
              ],
            },
            { cmd: ['access_log', '/var/log/nginx_access.log'] },
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
                { cmd: ['listen', '0.0.0.0:$PORT', 'default_server'] },
                { cmd: ['resolver', '8.8.8.8'] },
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

function convertFromPath(path: string) {
  return `^${path.replace(/\*/g, '(.*)').replace(/:slug/g, '[^/]+')}`
}

function convertToPath(path: string) {
  return path.replace(/:splat/g, '$1')
}

function parseRewrite({
  toPath,
  statusCode = 200,
}: Redirect): 'proxy' | 'rewrite' | 'error_page' {
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

    return statusCode === 200 ? 'rewrite' : 'error_page'
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
      cmd: ['rewrite', '.+', toPath],
    },
  ]
}

function generateRewrites(rewrites: Redirect[]): NginxDirective[] {
  const childrenByType = {
    rewrite: generateRewriteChildren,
    proxy: generateProxyRewriteChildren,
    error_page: generateErrorPageRewriteChildren,
  }

  return rewrites.map((rewrite) => {
    const { fromPath } = rewrite
    const type = parseRewrite(rewrite)

    return {
      cmd: ['location', '~*', convertFromPath(fromPath)],
      children: childrenByType[type](rewrite),
    }
  })
}

function storagePassTemplate(
  path: string,
  files: string[],
  { serveFileDirective }: PluginOptions
): NginxDirective | undefined {
  path = path.slice(1) // remove leading slash
  const filePath = files.find(
    (file) => file === path || file === posix.join(path, INDEX_HTML)
  )

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
  files: string[]
  options: PluginOptions
}): NginxDirective | undefined {
  const proxyPassDirective = storagePassTemplate(path, files, options)

  if (proxyPassDirective === undefined) {
    return undefined
  }

  return {
    cmd: ['location', '=', path],
    children: [
      ...headers.map(({ name, value }) => ({
        cmd: ['add_header', name, `"${value}"`],
      })),
      proxyPassDirective,
    ],
  }
}

function ident(text: string, space = '  ') {
  return text
    .split('\n')
    .map((line) => `${space}${line}`)
    .join('\n')
}
