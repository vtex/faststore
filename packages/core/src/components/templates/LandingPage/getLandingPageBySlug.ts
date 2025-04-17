import type { Locator } from '@vtex/client-cms'
import MissingContentError from 'src/sdk/error/MissingContentError/MissingContentError'
import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'
import storeConfig from 'discovery.config'

export const getLandingPageBySlug = async (
  slug: string,
  previewData: Locator
) => {
  try {
    if (storeConfig.cms.data) {
      const cmsData = JSON.parse(storeConfig.cms.data)
      const pageBySlug = cmsData['landingPage'].find((page: any) => {
        slug === page.settings?.seo?.slug
      })

      if (pageBySlug) {
        const landingPageData = await getPage<PageContentType>({
          contentType: 'landingPage',
          documentId: pageBySlug.documentId,
          versionId: pageBySlug.versionId,
        })

        return landingPageData
      }
    }

    const landingPageData = await getPage<PageContentType>({
      ...(previewData?.contentType === 'landingPage'
        ? previewData
        : {
            filters: {
              filters: { 'settings.seo.slug': `/${slug}` },
            },
          }),
      contentType: 'landingPage',
    })
    return landingPageData
  } catch (error) {
    if (error instanceof MissingContentError) {
      return null
    }

    throw error
  }
}
