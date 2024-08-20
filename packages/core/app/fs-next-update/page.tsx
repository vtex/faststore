import type { PageContentType } from 'app/server/cms'
import { getPage } from 'app/server/cms'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import RenderSections from 'app/components/cms/RenderSections'
import { OverriddenDefaultBannerText as BannerText } from 'app/components/sections/BannerText/OverriddenDefaultBannerText'
import { OverriddenDefaultHero as Hero } from 'app/components/sections/Hero/OverriddenDefaultHero'
import { OverriddenDefaultProductShelf as ProductShelf } from 'app/components/sections/ProductShelf/OverriddenDefaultProductShelf'
import { OverriddenDefaultNewsletter as Newsletter } from 'app/components/sections/Newsletter/OverriddenDefaultNewsletter'

import Incentives from 'app/components/sections/Incentives'
import PageProvider from 'app/sdk/overrides/PageProvider'
import { getDynamicContent } from 'app/utils/dynamicContent'
import { ComponentType } from 'react'
import storeConfig from '../../faststore.config'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Hero,
  Incentives,
  ProductShelf,
  BannerText,
  Newsletter,
  ...CUSTOM_COMPONENTS,
}

const getHomeData = async () => {
  const serverData = await getDynamicContent({ pageType: 'home' })

  if (storeConfig.cms.data) {
    const cmsData = JSON.parse(storeConfig.cms.data)
    const page = cmsData['home'][0]

    if (page) {
      const pageData = await getPage<PageContentType>({
        contentType: 'home',
        documentId: page.documentId,
        versionId: page.versionId,
      })

      return { page: pageData, serverData }
    }
  }
  /* TODO: we should use DraftMode instead of preview mode in Next 13 */
  const page = await getPage<PageContentType>({
    contentType: 'home',
  })

  return { page, serverData }
}

async function Page() {
  const {
    page: { sections },
    serverData,
  } = await getHomeData()

  const context = {
    data: serverData,
  }

  return (
    <PageProvider context={context}>
      <RenderSections sections={sections} components={COMPONENTS} />
    </PageProvider>
  )
}

Page.displayName = 'Page'

/*TODO: We should change the mark function to support server components*/
export default Page
