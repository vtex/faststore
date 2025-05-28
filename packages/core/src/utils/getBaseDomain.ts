import config from '../../discovery.config'

export const getBaseDomain = (urls: string[]) => {
  // Check if all hostnames are the same (unified domain scenario)
  if (urls[0] === urls[1]) {
    return `${new URL(config.storeUrl).hostname}`
  }

  const extractHostname = (url: string) => {
    try {
      const hostname = new URL(url).hostname
      const subDomainPrefixes = (config.api as any).subDomainPrefix || []
      // Remove subdomain prefixes
      // e.g. 'www.', 'shop.', 'loja.' from the hostname
      const prefixRegex = new RegExp(
        `^(${['www', ...subDomainPrefixes].join('|')})\\.`
      )

      console.log('Extracted hostname:', hostname.replace(prefixRegex, ''))

      return hostname.replace(prefixRegex, '')
    } catch {
      return ''
    }
  }

  const hostnames = urls.map(extractHostname)

  // Find common parts
  const splitHostnames = hostnames.map((hostname) =>
    hostname.split('.').reverse()
  )

  const minLength = Math.min(...splitHostnames.map((parts) => parts.length))

  const commonParts = []
  for (let i = 0; i < minLength; i++) {
    const partSet = new Set(splitHostnames.map((parts) => parts[i]))
    if (partSet.size === 1) {
      commonParts.push(splitHostnames[0][i])
    } else {
      break
    }
  }

  if (commonParts.length < 2) {
    // If we cannot find at least domain + tld, fallback to ''
    const err = `No common domain found for URLs: ${urls.join(', ')}`
    console.warn(
      `${err}. Please check the Production URLs in the discovery.config file.`
    )
    return ''
  }

  return '.' + commonParts.reverse().join('.')
}
