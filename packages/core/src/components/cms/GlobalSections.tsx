import { Locator, Section } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import type { ComponentType } from 'react'
import { PropsWithChildren, lazy } from 'react'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { PageContentType, getPage } from 'src/server/cms'

import Toast from 'app/components/common/Toast'
import RenderSections from '../../../app/components/cms/RenderSections'

import { OverriddenDefaultAlert as Alert } from 'app/components/sections/Alert/OverriddenDefaultAlert'
import Footer from 'src/components/sections/Footer'
import { OverriddenDefaultNavbar as Navbar } from 'src/components/sections/Navbar/OverriddenDefaultNavbar'
import { OverriddenDefaultRegionBar as RegionBar } from 'src/components/sections/RegionBar/OverriddenDefaultRegionBar'

const RegionModal = lazy(() => import('src/components/region/RegionModal'))
const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))

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
