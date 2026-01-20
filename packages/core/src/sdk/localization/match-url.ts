import config from 'discovery.config'

export function matchURLBinding(href: string) {
  let binding
  const matchedConfig = Object.entries(config.localization.locales).find(
    ([_, langConfig]: [string, any]) => {
      const hostURLObject = new URL(href)
      const langPath =
        /\/(\w{2}-\w{2})\/?/i.exec(hostURLObject.pathname)?.[1] ?? ''

      const origin = `${hostURLObject.protocol}//${hostURLObject.hostname}`
      binding = langConfig.bindings.find(
        ({ url }: { url: string }) =>
          (langPath && url === `${origin}/${langPath}`) ||
          (!langPath && url === origin)
      )

      return !!binding
    }
  )?.[1]

  return { config: matchedConfig, binding }
}
