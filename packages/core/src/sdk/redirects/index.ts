import storeConfig from 'discovery.config'
import { matcher } from 'src/customizations/src/redirects'

type GetRedirectArgs = {
  pathname: string
}

type GetRedirectResponse = {
  location: string
  status: number
}

export async function getRedirect({
  pathname,
}: GetRedirectArgs): Promise<GetRedirectResponse> {
  try {
    const redirectMatch = matcher({ pathname })
    if (redirectMatch) {
      return {
        location: redirectMatch,
        status: 301,
      }
    }

    const response = await fetch(
      `https://${storeConfig.api.storeId}.myvtex.com/redirect-evaluate${pathname}`
    )
    const rewriterData = (await response.json()) as GetRedirectResponse

    if (rewriterData.location) {
      return rewriterData
    }
    return null
  } catch (err) {
    // TODO: handle error logs
    console.error(err)
    return null
  }
}
