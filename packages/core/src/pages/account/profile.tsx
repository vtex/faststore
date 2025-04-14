/* ######################################### */
/* Mocked Page until development is finished, it will be removed after */

import type { Locator } from '@vtex/client-cms'
import type { GetServerSideProps } from 'next'
import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import { MyAccountLayout } from 'src/components/account'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'

import { getGlobalSectionsData } from 'src/components/cms/GlobalSections'

import { default as AfterSession } from 'src/customizations/src/myAccount/extensions/profile/after'
import { default as BeforeSession } from 'src/customizations/src/myAccount/extensions/profile/before'
import type { MyAccountProps } from 'src/experimental/myAccountSeverSideProps'
import { injectGlobalSections } from 'src/server/cms/global'

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

export default function Profile({ globalSections }: MyAccountProps) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <BeforeSession />
        <div>
          <h1>Profile</h1>
        </div>
        <AfterSession />
      </MyAccountLayout>
    </RenderSections>
  )
}

export const getServerSideProps: GetServerSideProps<
  MyAccountProps,
  Record<string, string>,
  Locator
> = async ({ previewData }) => {
  // TODO validate permissions here

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
