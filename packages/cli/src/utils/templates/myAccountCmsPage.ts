type MyAccountCmsPageTemplateArgs = {
  contentType: string
  routePath: string
  pagePath?: string
  beforePath?: string
  afterPath?: string
}

/**
 * Template for CMS-driven custom My Account pages
 */
export const myAccountCmsPageTemplate = ({
  contentType,
  routePath,
  pagePath,
  beforePath,
  afterPath,
}: MyAccountCmsPageTemplateArgs) => `
  import RenderSections, { RenderSectionsBase } from 'src/components/cms/RenderSections'
  import ACCOUNT_COMPONENTS from 'src/components/cms/account/Components'
  import { Layout } from 'src/components/account'
  import {
    myAccountCmsServerSideProps,
    type MyAccountCmsPageProps,
  } from 'src/experimental/myAccountCmsServerSideProps'
  import PageProvider from 'src/sdk/overrides/PageProvider'
  ${pagePath ? `import DynamicPage from '${pagePath}'` : ''}
  ${beforePath ? `import { default as BeforeSection } from '${beforePath}'` : ''}
  ${afterPath ? `import { default as AfterSection } from '${afterPath}'` : ''}

  export const getServerSideProps = myAccountCmsServerSideProps('${contentType}', '${routePath}')

  export default function Page({
    globalSections: globalSectionsProp,
    pageSections,
    navigationLabels,
    accountName,
    isRepresentative,
  }: MyAccountCmsPageProps) {
    const { sections: globalSections, settings: globalSettings } =
      globalSectionsProp ?? {}

    return (
      <PageProvider context={{ globalSettings, navigationLabels }}>
        <RenderSections
          globalSections={globalSections}
          components={ACCOUNT_COMPONENTS}
        >
          <Layout
            accountName={accountName}
            isRepresentative={isRepresentative}
            navigationLabels={navigationLabels}
          >
            ${beforePath ? '<BeforeSection />' : ''}
            <RenderSectionsBase
              sections={pageSections}
              components={ACCOUNT_COMPONENTS}
            />
            ${pagePath ? '<DynamicPage />' : ''}
            ${afterPath ? '<AfterSection />' : ''}
          </Layout>
        </RenderSections>
      </PageProvider>
    )
  }
`
