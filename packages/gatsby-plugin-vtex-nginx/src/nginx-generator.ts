import { posix } from 'path'

import { PUBLIC_CACHING_HEADER } from './constants'

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
  headersMap: PathHeadersMap
): string {
  return stringify([
    { cmd: ['worker_processes', '3'] },
    { cmd: ['worker_rlimit_nofile', '8192'] },
    { cmd: ['error_log', '/var/log/nginx_errors.log', 'debug'] },
    { cmd: ['pid', '/var/log/nginx_run.pid'] },
    { cmd: ['events'], children: [{ cmd: ['worker_connections', '1024'] }] },
    {
      cmd: ['http'],
      children: [
        { cmd: ['access_log', '/var/log/nginx_access.log'] },
        {
          cmd: ['map', '$http_referer', '$referer_path'],
          children: [
            { cmd: ['default', '""'] },
            { cmd: ['~^.*?://.*?/(?<path>.*)$', '$path'] },
          ],
        },
        {
          cmd: ['server'],
          children: [
            { cmd: ['listen', '0.0.0.0:$PORT', 'default_server'] },
            { cmd: ['resolver', '8.8.8.8'] },
            ...Object.entries(headersMap).map(([path, headers]) =>
              generatePathLocation(path, headers)
            ),
            ...generateRedirects(redirects),
            {
              cmd: ['location', '/'],
              children: [{ cmd: ['try_files', '/dev/null', '@s3'] }],
            },
            generateRewrites(rewrites),
            { cmd: ['error_page', '403', '=', '@clientSideFallback'] },
            {
              cmd: ['location', '@s3'],
              children: [
                {
                  cmd: [
                    'add_header',
                    PUBLIC_CACHING_HEADER.name,
                    `"${PUBLIC_CACHING_HEADER.value}"`,
                  ],
                },
                storagePassTemplate('$uri'),
                { cmd: ['proxy_intercept_errors', 'on'] },
              ],
            },
          ],
        },
      ],
    },
  ])
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

function generateRewrites(rewrites: Redirect[]): NginxDirective {
  return {
    cmd: ['location', '@clientSideFallback'],
    children: rewrites
      .map(({ fromPath, toPath }) => ({
        cmd: ['rewrite', convertFromPath(fromPath), toPath, 'last'],
      }))
      .concat([{ cmd: ['return', '404'] }]),
  }
}

function generateRedirects(redirects: Redirect[]): NginxDirective[] {
  return redirects.map((redirect) => {
    validateRedirect(redirect)
    const { fromPath, toPath } = redirect

    return {
      cmd: ['location', '~*', convertFromPath(fromPath)],
      children: [
        { cmd: ['proxy_pass', `${convertToPath(toPath)}$is_args$args`] },
        { cmd: ['proxy_ssl_server_name', 'on'] },
      ],
    }
  })
}

function storagePassTemplate(path: string): NginxDirective {
  return {
    cmd: [
      'proxy_pass',
      `https://s3.amazonaws.com/\${BUCKET}/\${BRANCH}/public${path}`,
    ],
  }
}

function generatePathLocation(path: string, headers: Header[]): NginxDirective {
  return {
    cmd: ['location', '=', path],
    children: [
      ...headers.map(({ name, value }) => ({
        cmd: ['add_header', name, `"${value}"`],
      })),
      storagePassTemplate(fixFilePath(path)),
    ],
  }
}

function fixFilePath(path: string) {
  if (path.indexOf('.') !== -1) {
    return path
  }

  return posix.join(path, 'index.html')
}

function ident(text: string, space = '  ') {
  return text
    .split('\n')
    .map((line) => `${space}${line}`)
    .join('\n')
}
