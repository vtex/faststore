export function buildStoreUrl(
  storeUrl: string,
  subDomainPrefix: string[]
): string {
  return storeUrl.replace(
    /^(.*:\/\/)?(.*)/,
    (_, protocol, restOfUrl) =>
      `${protocol || ''}${subDomainPrefix && subDomainPrefix.length > 0 ? `${subDomainPrefix[0]}.` : ''}${restOfUrl}`
  )
}
