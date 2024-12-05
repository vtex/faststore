// https://secure.vtexfaststore.com/api/io/redirect-evaluate?from=/produto/1&workspace=paladino

type GetRedirectProps = {
  pathname: string
}

type GetRedirectResponse = {
  location: string
  status: number
}

const searchRegex = /^\/busca\/([^/]+)/

// Custom function to match the pathname
function matcher(pathname: string) {
  const searchMatch = pathname.match(searchRegex)
  if (searchMatch) {
    const searchTerm = searchMatch[1].replaceAll('-', '+')
    return `s/?q=${searchTerm}`
  }
  return null
}
const pdpRegex = /^\/produto\/([^/]+)\/[^/]+$/

// Custom function to preprocess the pathname
function preprocessPathname(pathname: string) {
  const pdpMatch = pathname.match(pdpRegex)
  return pdpMatch ? `/produto/${pdpMatch[1]}` : pathname
}

export async function getRedirect({
  pathname,
}: GetRedirectProps): Promise<GetRedirectResponse> {
  try {
    const preprocessdPathname = preprocessPathname(pathname)
    const match = matcher(preprocessdPathname)

    if (match) {
      return {
        location: match,
        status: 301,
      }
    }

    const response = await fetch(
      `https://secure.vtexfaststore.com/api/io/redirect-evaluate?from=${pathname}&workspace=paladino`
    )
    const data = (await response.json()) as GetRedirectResponse
    if (data.location) {
      return data
    }
    return null
  } catch (err) {
    console.error(err)
    return null
  }
}
