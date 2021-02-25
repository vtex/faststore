import {
  LOCATIONS_ONLY_ENV_VAR,
  FILE_SERVE_DIRECTIVE_ENV_VAR,
  DISABLE_BROTLI_ENV_VAR,
} from './constants'

const defaultOptions: PluginOptions = {
  transformHeaders: undefined,
  writeOnlyLocations: false,
  disableBrotliEncoding: false,
  serveFileDirective: ['try_files', '/$file', '=404'],
  proxyCache: {
    key: 'fs_cache',
    entries: '10m',
    path: '/tmp/cache',
    levels: '1:2',
    maxSize: '10g',
    inactive: '60m',
    revalidate: 'on',
    minUses: '1',
    useStale: [
      'error',
      'timeout',
      'updating',
      'http_500',
      'http_502',
      'http_503',
      'http_504',
    ],
    useTmpPath: 'off',
    backgroundUpdate: 'on',
    lock: 'on',
  },
  plugins: [],
}

export function pluginOptions(options: Partial<PluginOptions>): PluginOptions {
  return {
    transformHeaders:
      options.transformHeaders ?? defaultOptions.transformHeaders,
    writeOnlyLocations:
      safeTransform(process.env[LOCATIONS_ONLY_ENV_VAR], (x) =>
        Boolean(JSON.parse(x))
      ) ??
      options.writeOnlyLocations ??
      defaultOptions.writeOnlyLocations,
    disableBrotliEncoding:
      safeTransform(process.env[DISABLE_BROTLI_ENV_VAR], (x) =>
        Boolean(JSON.parse(x))
      ) ??
      options.disableBrotliEncoding ??
      defaultOptions.disableBrotliEncoding,
    serveFileDirective:
      safeTransform(process.env[FILE_SERVE_DIRECTIVE_ENV_VAR], JSON.parse) ??
      options.serveFileDirective ??
      defaultOptions.serveFileDirective,
    plugins: options.plugins ?? defaultOptions.plugins,
    proxyCache: options.proxyCache ?? defaultOptions.proxyCache,
  }
}

function safeTransform<T, R>(
  value: T | undefined,
  f: (_: T) => R
): R | undefined {
  if (value === undefined) {
    return undefined
  }

  try {
    return f(value)
  } catch {
    return undefined
  }
}
