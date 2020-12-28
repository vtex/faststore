import { posix } from 'path'

import { INDEX_HTML } from './constants'

export {
  stringify,
  convertFromPath,
  parseRedirect,
  generateRewrites,
  generateRedirects,
  generatePathLocation,
  generateNginxConfiguration,
}

export interface NginxDirective {
  cmd: string[]
  children?: NginxDirective[]
}

function generateNginxConfiguration({
  rewrites,
  redirects,
  headersMap,
  files,
  options,
}: {
  rewrites: Redirect[]
  redirects: Redirect[]
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
    ...generateRedirects(redirects),
    ...generateRewrites(rewrites),
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
            { cmd: ['access_log', '/var/log/nginx_access.log'] },
            { cmd: ['include', '/etc/nginx/mime.types'] },
            { cmd: ['default_type', 'application/octet-stream'] },
            { cmd: ['disable_symlinks', 'off'] },
            { cmd: ['sendfile', 'on'] },
            { cmd: ['tcp_nopush', 'on'] },
            { cmd: ['keepalive_timeout', '65'] },
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

function parseRedirect({ toPath }: Redirect): 'proxy' | 'rewrite' {
  try {
    new URL(toPath)

    return 'proxy'
  } catch (ex) {
    // This wasn't a proxy url. It must be an internal redirect
  }

  try {
    // Parse as an internal redirect
    new URL(toPath, 'http://example.org')

    return 'rewrite'
  } catch (e) {
    throw new Error(`redirect toPath "${toPath}" must be a valid absolute URL`)
  }
}

function generateRewrites(rewrites: Redirect[]): NginxDirective[] {
  return rewrites.map(({ fromPath, toPath, statusCode = 200 }) => {
    return {
      cmd: ['location', '~*', convertFromPath(fromPath)],
      children: [
        {
          cmd: ['rewrite', '.+', toPath],
        },
      ],
    }
  })
}

function formatProxyHeaders(headers: Record<string, string> | undefined) {
  return Object.keys(headers ?? {}).map((name) => {
    return { cmd: ['proxy_set_header', name, headers![name]] }
  })
}

function generateRedirects(redirects: Redirect[]): NginxDirective[] {
  return redirects.map((redirect) => {
    const { fromPath, toPath, proxyHeaders } = redirect

    return {
      cmd: ['location', '~*', convertFromPath(fromPath)],
      children: [
        ...formatProxyHeaders(
          proxyHeaders as Record<string, string> | undefined
        ),
        { cmd: ['proxy_pass', `${convertToPath(toPath)}$is_args$args`] },
        { cmd: ['proxy_ssl_server_name', 'on'] },
      ],
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
