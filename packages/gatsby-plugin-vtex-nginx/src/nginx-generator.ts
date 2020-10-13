import { posix } from 'path'

import { INDEX_HTML, LOCATIONS_ONLY_ENV_VAR } from './constants'

export {
  stringify,
  convertFromPath,
  validateRedirect,
  generateRewrites,
  generateRedirects,
  generatePathLocation,
  generateNginxConfiguration,
}

export interface NginxDirective {
  cmd: string[]
  children?: NginxDirective[]
}

function generateNginxConfiguration(
  rewrites: Redirect[],
  redirects: Redirect[],
  headersMap: PathHeadersMap,
  files: string[]
): string {
  const locations = [
    ...Object.entries(headersMap)
      .map(([path, headers]) => generatePathLocation(path, headers, files))
      .filter<NginxDirective>(function (
        value: NginxDirective | undefined
      ): value is NginxDirective {
        return value !== undefined
      }),
    ...generateRedirects(redirects),
    ...generateRewrites(rewrites),
  ]

  const conf = process.env[LOCATIONS_ONLY_ENV_VAR]
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

function validateRedirect({ fromPath, toPath }: Redirect): boolean {
  let url: URL

  try {
    url = new URL(toPath)
  } catch (ex) {
    throw new Error(`redirect toPath "${toPath}" must be a valid absolute URL`)
  }

  return true
}

function generateRewrites(rewrites: Redirect[]): NginxDirective[] {
  return rewrites.map(({ fromPath, toPath }) => {
    return {
      cmd: ['location', '~*', convertFromPath(fromPath)],
      children: [{ cmd: ['rewrite', '.+', toPath] }],
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
    validateRedirect(redirect)
    const { fromPath, toPath, headers } = redirect

    return {
      cmd: ['location', '~*', convertFromPath(fromPath)],
      children: [
        ...formatProxyHeaders(headers as Record<string, string> | undefined),
        { cmd: ['proxy_pass', `${convertToPath(toPath)}$is_args$args`] },
        { cmd: ['proxy_ssl_server_name', 'on'] },
      ],
    }
  })
}

function storagePassTemplate(
  path: string,
  files: string[]
): NginxDirective | undefined {
  path = path.slice(1) // remove leading slash
  const filePath = files.find(
    (file) => file === path || file === posix.join(path, INDEX_HTML)
  )

  if (filePath === undefined) {
    return undefined
  }

  return {
    cmd: ['proxy_pass', `\${${filePath}}`],
  }
}

function generatePathLocation(
  path: string,
  headers: Header[],
  files: string[]
): NginxDirective | undefined {
  const proxyPassDirective = storagePassTemplate(path, files)

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
