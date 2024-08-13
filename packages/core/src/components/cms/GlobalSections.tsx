import { Locator, Section } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import type { ComponentType } from 'react'
import { PropsWithChildren } from 'react'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { PageContentType, getPage } from 'src/server/cms'

import RenderSections from './RenderSections'

import Alert from 'src/components/sections/Alert'
import Navbar from 'src/components/sections/Navbar'
import RegionBar from 'src/components/sections/RegionBar'

import dynamic from 'next/dynamic'

const Footer = dynamic(() => import('src/components/sections/Footer'), {
  ssr: false,
})
const CartSidebar = dynamic(() => import('src/components/cart/CartSidebar'), {
  ssr: false,
})
const RegionModal = dynamic(() => import('src/components/region/RegionModal'), {
  ssr: false,
})
const Toast = dynamic(() => import('src/components/common/Toast'), {
  ssr: false,
})

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

export type GlobalSectionsData = {
  sections: Section[]
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Navbar,
  RegionBar,
  RegionModal,
  CartSidebar,
  Footer,
  ...CUSTOM_COMPONENTS,
}

function GlobalSections({
  children,
  ...otherProps
}: PropsWithChildren<GlobalSectionsData>) {
  return (
    <RenderSections components={COMPONENTS} {...otherProps}>
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
      const pageData = await getPage<PageContentType>({
        contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return pageData
    }
  }

  const { sections } = await getPage<PageContentType>({
    ...(previewData?.contentType === GLOBAL_SECTIONS_CONTENT_TYPE &&
      previewData),
    contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
  })

  return { sections }
}
