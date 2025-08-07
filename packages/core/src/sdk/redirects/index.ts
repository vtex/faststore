import storeConfig from '../../../discovery.config'
import { matcher } from 'src/customizations/src/redirects'

type GetRedirectArgs = {
  pathname: string
}

type GetRedirectReturn = {
  destination: string
  permanent: boolean
}

type RewriterResponse = {
  location: string
  status: number
}

const PERMANENT_STATUS = 308

const ASSET_FILE_REGEX = /\.(js|css|png|jpg|jpeg|svg|gif|webp|ico|json|map)$/i

export async function getRedirect({
  pathname,
}: GetRedirectArgs): Promise<GetRedirectReturn> {
  const isValidPath = !ASSET_FILE_REGEX.test(pathname)

  if (!isValidPath) {
    return null
  }

  try {
    const redirectMatch = matcher({ pathname })
    if (redirectMatch) {
      return {
        destination: encodeURI(redirectMatch.destination),
        permanent: redirectMatch.permanent ?? true,
      }
    }

    const response = await fetch(
      `https://${storeConfig.api.storeId}.myvtex.com/_v/public/redirect-evaluate${pathname}`
    )

    if (!response.ok) {
      return null
    }

    const rewriterData = (await response.json()) as RewriterResponse

    if (rewriterData.location) {
      return {
        destination: rewriterData.location,
        permanent: rewriterData.status === PERMANENT_STATUS,
      }
    }
    return null
  } catch (err) {
    // TODO: handle error logs
    console.error(err)
    return null
  }
}
