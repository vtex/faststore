import config from 'discovery.config'
import { matchesBindingPath } from 'src/utils/localization/bindingPaths'

function shouldSkipHostnameCheck(hostname: string): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development'
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'
  const isPreviewUrl = hostname.endsWith('.vtex.app')

  return isLocalhost || isPreviewUrl || isDevelopment
}

export function matchURLBinding(href: string) {
  let binding
  const matchedConfig = Object.entries(config.localization.locales).find(
    ([_, langConfig]: [string, any]) => {
      const hostURLObject = new URL(href)
      const skipHostname = shouldSkipHostnameCheck(hostURLObject.hostname)

      binding = langConfig.bindings.find(({ url }: { url: string }) => {
        const configURLObject = new URL(url)

        const hostnameMatch =
          skipHostname || hostURLObject.hostname === configURLObject.hostname

        if (!hostnameMatch) {
          return false
        }

        // Verify protocol matches for security, but skip on environments
        // where the hostname is already relaxed (localhost, preview deploys).
        if (!skipHostname) {
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

        // Subdomain bindings rely on hostname, so when the hostname check
        // is skipped we can only match path-based bindings.
        if (isSubdomainBinding) {
          return !skipHostname
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
