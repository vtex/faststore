import { Locator, Section } from '@vtex/client-cms'
import type { ComponentType } from 'react'
import { PropsWithChildren, lazy } from 'react'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import { PageContentType, getPage } from 'src/server/cms'

import RegionBar from 'src/components/common/RegionBar'
import Toast from 'src/components/common/Toast'
import RenderSections from './RenderSections'

import Alert from 'src/components/sections/Alert'
import Footer from 'src/components/sections/Footer'
import Navbar from 'src/components/sections/Navbar'
const CartSidebar = lazy(() => import('src/components/cart/CartSidebar'))

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

export type GlobalSectionsData = {
  sections: Section[]
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  Navbar,
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

      <main>
        <RegionBar className="display-mobile" />
        {children}
      </main>
    </RenderSections>
  )
}

export default GlobalSections

export const getGlobalSectionsData = async (
  previewData: Locator
): Promise<GlobalSectionsData> => {
  const { sections } = await getPage<PageContentType>({
    ...(previewData?.contentType === GLOBAL_SECTIONS_CONTENT_TYPE
      ? previewData
      : { filters: { 'settings.seo.slug': '/' } }),
    contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
  })

  return { sections }
}
