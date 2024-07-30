// FastStore UI's base styles
import 'src/styles/global/index.scss'

import 'src/customizations/src/themes/index.scss'

import { Metadata } from 'next'

import ThirdPartyScripts from 'app/components/ThirdPartyScripts'
import AnalyticsHandler from 'app/sdk/analytics'
import ErrorBoundary from 'app/sdk/error/ErrorBoundary'
import UIProvider from 'app/sdk/ui/UIProvider'

// TODO: The path will probably change when overriding fonts in the future
import DefaultFont from 'app/styles/fonts'

import GlobalSections from './components/cms/GlobalSections'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

import { Section } from '@vtex/client-cms'
import storeConfig from 'faststore.config'
import { PageContentType, getPage } from 'app/server/cms'

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

// SEO metadata and tags
export const metadata: Metadata = {
  robots: {
    /*******************
     * TODO: This will be the default config when the `app` directory be in use
     *  // index: !storeConfig.experimental.noRobots,
     *  // follow: !storeConfig.experimental.noRobots,
     */
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalSections = await getGlobalSectionsData()

  return (
    <ErrorBoundary>
      <AnalyticsHandler />

      <html>
        <head>{!process.env.DISABLE_3P_SCRIPTS && <ThirdPartyScripts />}</head>
        {/**
         * TODO: Later when overriding fonts we should use the font variable in CSS files
         * https://nextjs.org/docs/app/api-reference/components/font#css-variables
         */}
        <body className={`theme ${DefaultFont.className}`}>
          <UIProvider>
            <GlobalSections {...globalSections}>{children}</GlobalSections>
          </UIProvider>
        </body>
      </html>
    </ErrorBoundary>
  )
}
