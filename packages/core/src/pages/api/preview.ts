import type { NextApiHandler, NextApiRequest } from 'next'

import { clientCMS } from 'src/server/cms'

class StatusError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

const pickParam = (req: NextApiRequest, parameter: string) => {
  const maybeParam = req.query[parameter]

  if (typeof maybeParam !== 'string') {
    throw new StatusError(
      `Parameter ${parameter} missing from querystring`,
      400
    )
  }

  return maybeParam
}

// TODO: Improve security by disabling CMS preview in production
const handler: NextApiHandler = async (req, res) => {
  try {
    const locator = {
      contentType: pickParam(req, 'contentType'),
      documentId: pickParam(req, 'documentId'),
      versionId: pickParam(req, 'versionId'),
    }

    // Fetch CMS to check if the provided `locator` exists
    const page = await clientCMS.getCMSPage(locator)

    // If the content doesn't exist prevent preview mode from being enabled
    if (!page) {
      throw new StatusError(
        `Content NotFound for ${JSON.stringify(locator, null, 2)}`,
        404
      )
    }

    // Enable Preview Mode by setting the cookies
    res.setPreviewData(locator, { maxAge: 3600 })

    // Redirect to the path from the fetched locator
    // TODO: apply redirect based on the content
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
