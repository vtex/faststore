/*
  TODO: Code in a template string is not a good practice because it becomes very difficult to maintain.
  There will be a component called MyAccountLayout that will wrap the entire MyAccount Layout, including the global sections, menu, etc.
  This will reduce the amount of code inside the template string.
*/

export const myAccountPageTemplate = (pagePath: string) => `
  import type { ComponentType } from 'react'
  import RenderSections from 'src/components/cms/RenderSections'
  import { default as GLOBAL_COMPONENTS } from 'src/components/cms/global/Components'
  import CUSTOM_COMPONENTS from 'src/customizations/src/components'
  import { MyAccountLayout } from 'src/components/account'
  import {
    getServerSideProps,
    type MyAccountProps,
  } from 'src/experimental/myAccountSeverSideProps'
  import DynamicPage from '${pagePath}';
  import PageProvider from 'src/sdk/overrides/PageProvider'
  /* A list of components that can be used in the CMS. */
  const COMPONENTS: Record<string, ComponentType<any>> = {
    ...GLOBAL_COMPONENTS,
    ...CUSTOM_COMPONENTS,
  }

  function Page({ globalSections: globalSectionsProp, accountName, isRepresentative}: MyAccountProps) {
    const { sections: globalSections, settings: globalSettings } = globalSectionsProp ?? {}

    return (
     <PageProvider context={{ globalSettings }}>
        <RenderSections
          globalSections={globalSections}
          components={COMPONENTS}
        >
          <MyAccountLayout accountName={accountName} isRepresentative={isRepresentative}>
            <DynamicPage />
          </MyAccountLayout>
        </RenderSections>
      </PageProvider>
    )
  }

  export { getServerSideProps }

  export default Page
`
