import type { NextApiHandler, NextApiRequest } from 'next'
import type { Locator } from '@vtex/client-cms'

import { clientCMS } from 'src/server/cms'
import { previewRedirects } from '../../../discovery.config'

type Settings = {
  seo: {
    slug: string
    title: string
    description: string
  }
}
class StatusError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

const pickParam = (req: NextApiRequest, parameter: string) => {
  const maybeParam = req.query[parameter]

  if (typeof maybeParam !== 'string') {
    return undefined
  }

  return maybeParam
}

// TODO: Improve security by disabling CMS preview in production
const handler: NextApiHandler = async (req, res) => {
  try {
    const locator = [
      'contentType',
      'documentId',
      'versionId',
      'releaseId',
    ].reduce((acc, param) => {
      const value = pickParam(req, param)

      if (value !== undefined) acc[param] = value

      return acc
    }, {} as Record<string, string>)

    // Check if required path params are present
    if (!locator.contentType || !locator.documentId) {
      throw new StatusError(
        `The following path params are required: contentType, documentId`,
        400
      )
    }

    // Check if at least one of the querystring params are present
    if (!locator.versionId && !locator.releaseId) {
      throw new StatusError(
        `One of the following querystring params are required: versionId, releaseId`,
        400
      )
    }

    // Fetch CMS to check if the provided `locator` exists
    const page = await clientCMS.getCMSPage(locator as Locator)

    // If the content doesn't exist prevent preview mode from being enabled
    if (!page) {
      throw new StatusError(
        `Content NotFound for ${JSON.stringify(locator, null, 2)}`,
        404
      )
    }

    // Enable Preview Mode by setting the cookies
    res.setPreviewData(locator, {
      maxAge: 3600,
      path: (page.settings as Settings)?.seo?.slug,
    })

    // Redirect to the path from the fetched locator
    const redirects = previewRedirects as Record<string, string>
    if (redirects[locator.contentType]) {
      res.redirect(redirects[locator.contentType])
      return
    }

    if (locator.contentType === 'landingPage') {
      res.redirect(`${(page.settings as Settings)?.seo.slug}`)
      return
    }

    res.redirect('/')
  } catch (error) {
    if (error instanceof StatusError) {
      res.status(error.status).end(error.message)

      return
    }

    throw error
  }
}

export default handler
