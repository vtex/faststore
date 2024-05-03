// FastStore UI's base styles
import 'src/styles/global/index.scss'

import 'src/customizations/src/themes/index.scss'

import ThirdPartyScripts from 'app/components/ThirdPartyScripts'
import ErrorBoundary from 'app/sdk/error/ErrorBoundary'
import AnalyticsHandler from 'app/sdk/analytics'
// import UIProvider from 'app/sdk/ui/UIProvider'
// import { WebFonts } from 'src/customizations/src/GlobalOverrides'

// import GlobalSections from './components/cms/GlobalSections'

export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalSections'

import { Section } from '@vtex/client-cms'

export type GlobalSectionsData = {
  sections: Section[]
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalSections = { sections: [] }
  return (
    <ErrorBoundary>
      {/* TODO: we should use metadata api from Next 13 */}
      {/* <DefaultSeo norobots={storeConfig.experimental.noRobots} /> */}

      <AnalyticsHandler />
      {/*
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
      </html> */}
    </ErrorBoundary>
  )
}
