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
