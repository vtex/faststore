import type { NextApiHandler, NextApiRequest } from 'next'
import type { Locator } from '@vtex/client-cms'

import { previewRedirects } from '../../../discovery.config'
import { contentService } from 'src/server/content/service'

type Settings = {
  seo: {
    slug: string
    title: string
    description: string
  }
}
class StatusError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message)
  }
}

const pickParam = (req: NextApiRequest, parameter: string) => {
  const maybeParam = req.query[parameter]
  return typeof maybeParam === 'string' ? maybeParam : undefined
}

const getSeoSlug = (page: any, origin?: string): string | undefined => {
  if (origin === 'CP') {
    if (!page.settings?.seo) return undefined

    const seoKey = Object.keys(page.settings.seo)[0]
    if (!seoKey) return undefined

    return page.settings.seo[seoKey]
  }
  return (page.settings as Settings)?.seo?.slug
}

const setPreviewAndRedirect = (
  res: any,
  previewData: Record<string, string>,
  redirectPath: string
) => {
  res.setPreviewData(previewData, {
    maxAge: 3600,
    path: redirectPath,
  })
  console.log('Redirecting to:', redirectPath)
  res.redirect(redirectPath)
}

// TODO: Improve security by disabling CMS preview in production
const handler: NextApiHandler = async (req, res) => {
  try {
    const origin = pickParam(req, 'origin')
    let slug = pickParam(req, 'slug')

    const locator = [
      'contentType',
      'documentId',
      'versionId',
      'releaseId',
    ].reduce(
      (acc, param) => {
        const value = pickParam(req, param)

        if (value !== undefined) acc[param] = value

        return acc
      },
      {} as Record<string, string>
    )

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

    if (slug && slug.length > 0 && origin === 'CP') {
      const previewData = { ...locator, origin, slug }
      return setPreviewAndRedirect(res, previewData, `/${slug}`)
    }

    // Fetch CMS to check if the provided `locator` exists
    const page = await contentService.getSingleContent({
      cmsOptions: locator as Locator,
      slug,
      origin,
      isPreview: true,
    })

    // If the content doesn't exist prevent preview mode from being enabled
    if (!page) {
      throw new StatusError(
        `Content NotFound for ${JSON.stringify(locator, null, 2)}`,
        404
      )
    }

    slug = getSeoSlug(page, origin)

    const previewData = {
      ...locator,
      origin,
    }

    // Redirect to the path from the fetched locator
    const redirects = previewRedirects as Record<string, string>
    if (redirects[locator.contentType]) {
      return setPreviewAndRedirect(
        res,
        previewData,
        redirects[locator.contentType]
      )
    }

    if (locator.contentType === 'landingPage') {
      return setPreviewAndRedirect(res, previewData, slug)
    }

    return setPreviewAndRedirect(res, previewData, '/')
  } catch (error) {
    if (error instanceof StatusError) {
      res.status(error.status).end(error.message)

      return
    }

    throw error
  }
}

export default handler
