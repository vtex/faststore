import { PageContentType, getPage } from 'app/server/cms'
import storeConfig from 'faststore.config'
import type { ComponentType } from 'react'

import RenderSections from 'app/components/cms/RenderSections'
import BannerNewsletter from 'app/components/sections/BannerNewsletter/BannerNewsletter'
import { OverriddenDefaultBannerText as BannerText } from 'app/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultHero as Hero } from 'app/components/sections/Hero/OverriddenDefaultHero'
import Incentives from 'app/components/sections/Incentives'
import { OverriddenDefaultNewsletter as Newsletter } from 'app/components/sections/Newsletter/OverriddenDefaultNewsletter'
import { OverriddenDefaultProductShelf as ProductShelf } from 'app/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import ProductTiles from 'app/components/sections/ProductTiles'
import PageProvider from 'app/sdk/overrides/PageProvider'
import { getDynamicContent } from 'app/utils/dynamicContent'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  Incentives,
  ProductShelf,
  ProductTiles,
  BannerText,
  BannerNewsletter,
  Newsletter,
  ...CUSTOM_COMPONENTS,
}

async function getHomePageData() {
  const serverDataPromise = getDynamicContent({ pageType: 'home' })

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['home'][0]

    if (page) {
      const pageDataPromise = getPage<PageContentType>({
        contentType: 'home',
        documentId: page.documentId,
        versionId: page.versionId,
      })

      const [serverData, pageData] = await Promise.all([
        serverDataPromise,
        pageDataPromise,
      ])

      return {
        props: { page: pageData, serverData },
      }
    }
  }

  // TODO: we should use DraftMode instead of preview mode in Next 13
  const pagePromise = getPage<PageContentType>({
    contentType: 'home',
  })

  const [serverData, pageData] = await Promise.all([
    serverDataPromise,
    pagePromise,
  ])

  return { page: pageData, serverData }
}

export default async function Page() {
  const { page, serverData } = await getHomePageData()
  const { sections } = page

  const context = {
    data: serverData,
  }

  return (
    <PageProvider context={context}>
      <RenderSections sections={sections} components={COMPONENTS} />
    </PageProvider>
  )
}
