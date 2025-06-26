import { NextSeo } from 'next-seo'
import { useEffect } from 'react'

import type { Locator } from '@vtex/client-cms'
import type { GetStaticProps } from 'next'
import type { ComponentType } from 'react'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import {
  type GlobalSectionsData,
  getGlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import RenderSections from 'src/components/cms/RenderSections'
import PageProvider from 'src/sdk/overrides/PageProvider'
import { injectGlobalSections } from 'src/server/cms/global'
import storeConfig from '../../discovery.config'

type Props = {
  globalSections: GlobalSectionsData
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

function Page({
  globalSections: { sections: globalSections, settings: globalSettings },
}: Props) {
  useEffect(() => {
    window.location.href = storeConfig.checkoutUrl
  }, [])

  return (
    <PageProvider context={{ globalSettings }}>
      <RenderSections globalSections={globalSections} components={COMPONENTS}>
        <NextSeo noindex nofollow />

        <div>loading...</div>
      </RenderSections>
    </PageProvider>
  )
}

export const getStaticProps: GetStaticProps<
  Props,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  const [
    globalSectionsPromise,
    globalSectionsHeaderPromise,
    globalSectionsFooterPromise,
  ] = getGlobalSectionsData(previewData)

  const [globalSections, globalSectionsHeader, globalSectionsFooter] =
    await Promise.all([
      globalSectionsPromise,
      globalSectionsHeaderPromise,
      globalSectionsFooterPromise,
    ])

  const globalSectionsResult = injectGlobalSections({
    globalSections,
    globalSectionsHeader,
    globalSectionsFooter,
  })

  return {
    props: { globalSections: globalSectionsResult },
  }
}

export default Page
