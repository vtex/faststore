import config from 'discovery.config'

const isDevelopment = process.env.NODE_ENV === 'development'

export function matchURLBinding(href: string) {
  let binding
  const matchedConfig = Object.entries(config.localization.locales).find(
    ([_, langConfig]: [string, any]) => {
      const hostURLObject = new URL(href)
      const langPath =
        /\/(\w{2}-\w{2})\/?/i.exec(hostURLObject.pathname)?.[1] ?? ''

      const origin = `${hostURLObject.protocol}//${hostURLObject.hostname}`

      binding = langConfig.bindings.find(({ url }: { url: string }) => {
        const configURLObject = new URL(url)

        // In development, allow protocol mismatch (http vs https) and ignore port
        if (isDevelopment) {
          const hostnameMatch =
            hostURLObject.hostname === configURLObject.hostname
          const pathMatch =
            !langPath || configURLObject.pathname === `/${langPath}`

          return hostnameMatch && pathMatch
        }

        // In production, require exact origin match
        return (
          (langPath && url === `${origin}/${langPath}`) ||
          (!langPath && url === origin)
        )
      })

      return !!binding
    }
  )?.[1]

  return { config: matchedConfig, binding }
}
