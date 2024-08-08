import type { PageContentType } from 'src/server/cms'
import { getPage } from 'src/server/cms'

import { getDynamicContent } from 'src/utils/dynamicContent'
import storeConfig from '../../faststore.config'

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
  const { page } = await getHomeData()

  return (
    <>
      <h1>App router: Home</h1>
      <br />

      {JSON.stringify(page, null, 2)}
    </>
  )
}

Page.displayName = 'Page'

export default Page
