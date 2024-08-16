import { Locator, Section } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import { PropsWithChildren } from 'react'
import { PageContentType, getPage } from 'src/server/cms'

import Toast from 'src/components/common/Toast'
import RenderSections from './RenderSections'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

export type GlobalSectionsData = {
  sections: Section[]
}

function GlobalSections({
  children,
  ...otherProps
}: PropsWithChildren<GlobalSectionsData>) {
  return (
    <RenderSections {...otherProps}>
      <Toast />

      <main>{children}</main>
    </RenderSections>
  )
}

export default GlobalSections

export const getGlobalSectionsData = async (
  previewData: Locator
): Promise<GlobalSectionsData> => {
  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData[GLOBAL_SECTIONS_CONTENT_TYPE][0]

    if (page) {
      const pageData = getPage<PageContentType>({
        contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return pageData
    }
  }

  const pageData = getPage<PageContentType>({
    ...(previewData?.contentType === GLOBAL_SECTIONS_CONTENT_TYPE &&
      previewData),
    contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
  })

  return pageData
}
