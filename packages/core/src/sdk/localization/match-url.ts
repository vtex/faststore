import config from 'discovery.config'
import { matchesBindingPath } from 'src/utils/localization/bindingPaths'

const isDevelopment = process.env.NODE_ENV === 'development'

export function matchURLBinding(href: string) {
  let binding
  const matchedConfig = Object.entries(config.localization.locales).find(
    ([_, langConfig]: [string, any]) => {
      const hostURLObject = new URL(href)

      binding = langConfig.bindings.find(({ url }: { url: string }) => {
        const configURLObject = new URL(url)

        // In development, allow localhost to match any hostname for easier testing
        const isLocalhost =
          hostURLObject.hostname === 'localhost' ||
          hostURLObject.hostname === '127.0.0.1'

        const hostnameMatch =
          (isDevelopment && isLocalhost) ||
          hostURLObject.hostname === configURLObject.hostname

        if (!hostnameMatch) {
          return false
        }

        // In production, also verify protocol matches for security
        // In development, allow http vs https mismatch (e.g., local http testing with https config)
        if (!isDevelopment) {
          const protocolMatch =
            hostURLObject.protocol === configURLObject.protocol

          if (!protocolMatch) {
            return false
          }
        }

        // If the config pathname is the root, it is a subdomain binding
        // and we don't need to check if pathname matches.
        const configPathname =
          configURLObject.pathname.replace(/\/$/, '') || '/'
        const isSubdomainBinding = configPathname === '/'

        if (isSubdomainBinding) {
          return true
        }

        // Check if pathname matches (exact or prefix match)
        return matchesBindingPath(
          hostURLObject.pathname,
          configURLObject.pathname
        )
      })

      return !!binding
    }
  )?.[1]

  return { config: matchedConfig, binding }
}
