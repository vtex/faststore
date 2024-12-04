// https://secure.vtexfaststore.com/api/io/redirect-evaluate?from=/produto/1&workspace=paladino

type GetRedirectProps = {
  pathname: string
}

type GetRedirectResponse = {
  location: string
  status: number
}

export async function getRedirect({
  pathname,
}: GetRedirectProps): Promise<GetRedirectResponse> {
  try {
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
