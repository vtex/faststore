import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  memo,
  useMemo,
} from 'react'

import { Section } from '@vtex/client-cms'
import dynamic from 'next/dynamic'
import SectionBoundary from './SectionBoundary'
import ViewportObserver from './ViewportObserver'
import COMPONENTS from './global/Components'

interface Props {
  components?: Record<string, ComponentType<any>>
  globalSections?: Array<{ name: string; data: any }>
  sections?: Array<{ name: string; data: any }>
}

const SECTIONS_OUT_OF_VIEWPORT = ['CartSidebar', 'RegionModal']

const Toast = dynamic(
  () => import(/* webpackChunkName: "Toast" */ '../common/Toast'),
  { ssr: false }
)

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

/**
 * This component is responsible for lazy loading Sections that are out of the viewport.
 * It achieves this by:
 * 1. Using the IntersectionObserver API for Sections below the fold.
 * 2. Checking the UI context for Sections that are not in the viewport, such as the CartSidebar and RegionModal.
 *
 * @param sectionName
 */
export const LazyLoadingSection = ({
  sectionName,
  children,
}: {
  sectionName: string
  children: ReactNode
}) => {
  return (
    <ViewportObserver sectionName={sectionName}>{children}</ViewportObserver>
  )
}

const RenderSectionsBase = ({ sections = [], components }: Props) => {
  return (
    <>
      {sections.map(({ name, data = {} }, index) => {
        const Component = components[name]

        if (!Component) {
          // TODO: add a documentation link to help to do this
          console.warn(
            `${name} not found. Add a new component for this section or remove it from the CMS`
          )

          return null
        }

        return (
          <SectionBoundary key={`cms-section-${name}-${index}`} name={name}>
            <LazyLoadingSection sectionName={name}>
              <Component {...data} />
            </LazyLoadingSection>
          </SectionBoundary>
        )
      })}
    </>
  )
}

function RenderSections({
  children,
  globalSections,
  sections,
  components = COMPONENTS,
}: PropsWithChildren<Props>) {
  const { firstSections, lastSections } = useDividedSections(
    globalSections ?? sections
  )

  return (
    <>
      {firstSections && (
        <RenderSectionsBase sections={firstSections} components={components} />
      )}
      {sections && sections.length > 0 && (
        <RenderSectionsBase sections={sections} components={components} />
      )}
      {children}
      <LazyLoadingSection sectionName="Toast">
        <Toast />
      </LazyLoadingSection>

      {lastSections && (
        <RenderSectionsBase sections={lastSections} components={components} />
      )}
    </>
  )
}

export default memo(RenderSections)
