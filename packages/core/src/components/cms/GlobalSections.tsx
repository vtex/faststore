import { PropsWithChildren, useMemo } from 'react'

import { Locator, Section } from '@vtex/client-cms'
import { PageContentType, getPage } from 'src/server/cms'
import CUSTOM_COMPONENTS from 'src/customizations/components'
import type { ComponentType } from 'react'

import RenderSections from './RenderSections'
import { RegionBar } from '@faststore/components'
import Alert from 'src/components/sections/Alert/Alert'
import Navbar from 'src/components/navigation/Navbar'
import Footer from 'src/components/common/Footer'
import Toast from 'src/components/common/Toast'

// TODO: When the CMS is finished, switch to using 'globalSections'.
export const GLOBAL_SECTIONS_CONTENT_TYPE = 'globalAlert'

export type GlobalSectionsData = {
  sections: Section[]
}

/* A list of components that can be used in the CMS. */
const COMPONENTS: Record<string, ComponentType<any>> = {
  Alert,
  ...CUSTOM_COMPONENTS,
}

const useDividedSections = (sections: Section[]) => {
  return useMemo(() => {
    const indexChildren = sections.findIndex(({ name }) => name === 'Children')
    const hasChildren = indexChildren > -1

    return {
      hasChildren,
      firstSections: hasChildren ? sections.slice(0, indexChildren) : sections,
      ...(hasChildren && { lastSections: sections.slice(indexChildren + 1) }),
    }
  }, [sections])
}

function GlobalSections({
  children,
  sections,
}: PropsWithChildren<GlobalSectionsData>) {
  const { hasChildren, firstSections, lastSections } =
    useDividedSections(sections)

  return (
    <>
      <RenderSections sections={firstSections} components={COMPONENTS} />
      <Navbar />

      <Toast />

      <main>
        <RegionBar className="display-mobile" />
        {children}
      </main>

      <Footer />
      {hasChildren && (
        <RenderSections sections={lastSections} components={COMPONENTS} />
      )}
    </>
  )
}

export default GlobalSections

export const getGlobalSectionsData = async (
  previewData: Locator
): Promise<GlobalSectionsData> => {
  const { sections } = await getPage<PageContentType>({
    ...(previewData?.contentType === GLOBAL_SECTIONS_CONTENT_TYPE
      ? previewData
      : { filters: { 'settings.seo.slug': '/' } }),
    contentType: GLOBAL_SECTIONS_CONTENT_TYPE,
  })

  return { sections }
}
