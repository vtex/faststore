export const myAccountPageTemplate = (pagePath: string) => `
  import type { Locator } from '@vtex/client-cms'
  import type { GetServerSideProps } from 'next'
  import type { ComponentType } from 'react'
  import {
    type GlobalSectionsData,
    getGlobalSectionsData,
  } from 'src/components/cms/GlobalSections'
  import RenderSections from 'src/components/cms/RenderSections'
  import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
  import CUSTOM_COMPONENTS from 'src/customizations/src/components'
  import dynamicPage from '${pagePath}';

  type Props = {
    globalSections: GlobalSectionsData
  }

  /* A list of components that can be used in the CMS. */
  const COMPONENTS: Record<string, ComponentType<any>> = {
    ...GLOBAL_COMPONENTS,
    ...CUSTOM_COMPONENTS,
  }

  function Page({ globalSections }: Props) {
    return (
      <RenderSections
        globalSections={globalSections.sections}
        components={COMPONENTS}
      >
      {dynamicPage()}
      </RenderSections>
    )
  }

  export const getServerSideProps: GetServerSideProps<
    Props,
    Record<string, string>,
    Locator
  > = async ({ previewData }) => {
    const globalSections = await getGlobalSectionsData(previewData)

    return {
      props: { globalSections },
    }
  }

  export default Page

`
