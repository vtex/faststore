import { NginxDirective } from './../../dist/nginx-generator.d'
import {
  PageProps,
  Actions,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'

declare global {
  type Manifest = Record<string, string[]>

  interface NginxDirective {
    cmd: string[]
    children?: NginxDirective[]
  }

  type NginxRewriteType = 'proxy' | 'rewrite' | 'redirect' | 'error_page'

  type RedirectNginxOptions = {
    onGenerateNginxRewrites?: (
      commands: NginxDirective[],
      type: NginxRewriteType
    ) => NginxDirective[]
  }

  type Redirect = Parameters<Actions['createRedirect']>[0] &
    RedirectNginxOptions

  type Page = PageProps['pageResources']['page'] & {
    mode?: 'SSG' | 'SSR' | 'DSG'
  }

  interface Header {
    name: string
    value: string
  }

  interface PathHeadersMap {
    [path: string]: Header[]
  }

  // All options are optional but we omit the typescript ?
  // because the user options will be provided default values.
  interface PluginOptions extends GatsbyPluginOptions {
    /**
     * Use to modify the generated headers.
     */
    transformHeaders:
      | ((headers: string[], path: string) => string[])
      | undefined
    /**
     * When set, the plugin will generate an incomplete nginx configuration with only location directives.
     * May be overridden with environment variable NGINX_LOCATIONS_ONLY
     * @default false
     */
    writeOnlyLocations: boolean
    /**
     * Specify the nginx directive used to serve files. The placeholder $file must be used and
     * will be substituted with the asset path relative to the folder public without a leading slash.
     * May be overridden with environment variable NGINX_SERVE_FILE_DIRECTIVE in JSON format
     * @example
     * // serve files from a s3 bucket
     * [ "proxy_pass", "https://s3.amazonaws.com/static-site-bucket/$file" ]
     * // serve files from file system
     * [ "try_files", "$file" ]
     */
    serveFileDirective: string[]
    /**
     * When set, the nginx brotli [plugin](https://github.com/google/ngx_brotli) won't be enabled.
     * @default false
     */
    disableBrotliEncoding: boolean
    /**
     * Add attributes to nginx's server block options
     *
     * @example
     * // Add Google dns server
     * serverOptions: [['resolver', '8.8.8.8']]
     *
     * @default [['resolver', '8.8.8.8']]
     */
    serverOptions: string[][]
    /**
     * Add attributes to nginx's http block options
     *
     * @example
     * // Disable merge_slashes nginx config
     * httpOptions: [['merge_slashes', 'off']]
     *
     * * @default [['proxy_http_version', '1.1']]
     */
    httpOptions: string[][]
    /**
     * Add attributes to nginx's locations
     *
     * @example
     * // Serve local files by url
     * locations: {
     *    append: {
     *      cmd: ['location', '/'],
     *      children: [
     *        {
     *          cmd: [
     *            'add_header',
     *            'Cache-Control',
     *            '"public, max-age=0, must-revalidate"',
     *          ],
     *        },
     *        {
     *          cmd: [
     *            'try_files',
     *            '$uri',
     *            '$uri/',
     *            '$uri/index.html',
     *            '$uri.html',
     *            '=404',
     *          ],
     *        },
     *      ],
     *    },
     *  },
     *
     * * @default { append: [], prepend: [] }
     */
    locations: {
      append: NginxDirective[]
      prepend: NginxDirective[]
    }

    /**
     * Adds headers to all nginx responses
     *
     * @example
     * // Adds custom header to every response to identify sender's version
     * customGlobalHeaders: [{name: 'x-vtex-renderer', value: 'faststore@1'}]
     *
     * * @default []
     */
    customGlobalHeaders: Header[]
  }
}
