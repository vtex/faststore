import {
  PageProps,
  Actions,
  PluginOptions as GatsbyPluginOptions,
} from 'gatsby'

declare global {
  type Manifest = Record<string, string[]>

  type Redirect = Actions['createRedirect'] extends (redirect: infer R) => any
    ? R
    : never

  type Page = PageProps['pageResources']['page']

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
     * May be overriden with environment variable NGINX_LOCATIONS_ONLY
     * @default false
     */
    writeOnlyLocations: boolean
    /**
     * Specify the nginx directive used to serve files. The placeholder $file must be used and
     * will be substituted with the asset path relative to the folder public without a leading slash.
     * May be overriden with environment variable NGINX_SERVE_FILE_DIRECTIVE in JSON format
     * @example
     * // serve files from a s3 bucket
     * ["proxy_pass", "https://s3.amazonaws.com/static-site-bucket/$file"]
     * // serve files from file system
     * ["try_files", "$file"]
     */
    serveFileDirective: string[]
    /**
     * When set, the nginx brotli [plugin](https://github.com/google/ngx_brotli) won't be enabled.
     * @default false
     */
    disableBrotliEncoding: boolean
  }
}
