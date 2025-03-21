import { NextSeo } from 'next-seo'
import type { ComponentType } from 'react'
import {
  getGlobalSectionsData,
  type GlobalSectionsData,
} from 'src/components/cms/GlobalSections'
import RenderSections from 'src/components/cms/RenderSections'
import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
import CUSTOM_COMPONENTS from 'src/customizations/src/components'
import { MyAccountLayout } from 'src/components/account'
import type { GetStaticProps } from 'next'
import type { Locator } from '@vtex/client-cms'
import { injectGlobalSections } from 'src/server/cms/global'

type Props = {
  globalSections: GlobalSectionsData
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  ...GLOBAL_COMPONENTS,
  ...CUSTOM_COMPONENTS,
}

const style = {
  alignContent: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  backgroundColor: 'blue',
  h1: {
    color: 'white',
    fontSize: '100px',
  },
}

export default function Profile({ globalSections }: Props) {
  return (
    <RenderSections
      globalSections={globalSections.sections}
      components={COMPONENTS}
    >
      <NextSeo noindex nofollow />

      <MyAccountLayout>
        <div style={style}>
          <h1 style={style.h1}>Profile</h1>
        </div>
      </MyAccountLayout>
    </RenderSections>
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
