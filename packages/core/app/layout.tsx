// FastStore UI's base styles
import 'src/styles/global/index.scss'

import 'src/customizations/src/themes/index.scss'

import ThirdPartyScripts from 'app/components/ThirdPartyScripts'
import AnalyticsHandler from 'app/sdk/analytics'
import ErrorBoundary from 'app/sdk/error/ErrorBoundary'
import UIProvider from 'app/sdk/ui/UIProvider'
import { WebFonts } from 'src/customizations/src/GlobalOverrides'

import GlobalSections from './components/cms/GlobalSections'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

import { Section } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import { PageContentType, getPage } from 'src/server/cms'

export type GlobalSectionsData = {
  sections: Section[]
}

async function getGlobalSectionsData() {
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

  {
    /* TODO: we should use DraftMode instead of preview mode in Next 13 */
  }
  const { sections } = await getPage<PageContentType>({
    contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
  })

  return { sections }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalSections = await getGlobalSectionsData()
  return (
    <ErrorBoundary>
      {/* TODO: we should use metadata api from Next 13 */}
      {/* <DefaultSeo norobots={storeConfig.experimental.noRobots} /> */}

      <AnalyticsHandler />

      <html>
        <head>
          {!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}
          <WebFonts />
        </head>
        <body className="theme">
          <UIProvider>
            <GlobalSections {...globalSections}>{children}</GlobalSections>
          </UIProvider>
        </body>
      </html>
    </ErrorBoundary>
  )
}
