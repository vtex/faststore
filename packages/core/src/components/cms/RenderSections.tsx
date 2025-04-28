import {
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
  memo,
  useMemo,
} from 'react'

import { useUI } from '@faststore/ui'
import type { Section } from '@vtex/client-cms'
import dynamic from 'next/dynamic'
import useTTI from 'src/sdk/performance/useTTI'
import SectionBoundary from './SectionBoundary'
import ViewportObserver from './ViewportObserver'
import COMPONENTS from './global/Components'

interface Props {
  components?: Record<string, ComponentType<any>>
  globalSections?: Array<{ name: string; data: any }>
  sections?: Array<{ name: string; data: any; $componentKey?: string }>
  isInteractive?: boolean
}

export type ComponentTypeWithComponentKey<T> = ComponentType<T> & {
  $componentKey?: string
}

export const getComponentKey = (
  Component: ComponentTypeWithComponentKey<any>,
  name: string
) => Component.$componentKey ?? name

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
  debug = false,
  isInteractive = false,
}: {
  sectionName: string
  children: ReactNode
  debug?: boolean
  isInteractive?: boolean
}) => {
  const { cart: displayCart, modal: displayModal } = useUI()
  if (SECTIONS_OUT_OF_VIEWPORT.includes(sectionName)) {
    const shouldLoad =
      isInteractive ||
      (sectionName === 'CartSidebar' && displayCart) ||
      (sectionName === 'RegionModal' && displayModal)

    if (debug) {
      console.log(
        `section SECTIONS_OUT_OF_VIEWPORT '${sectionName}' shouldLoad:`,
        shouldLoad
      )
    }

    return shouldLoad ? <>{children}</> : null
  }

  return (
    <ViewportObserver
      sectionName={sectionName}
      debug={debug}
      isInteractive={isInteractive}
    >
      {children}
    </ViewportObserver>
  )
}

export const RenderSectionsBase = ({
  sections = [],
  components,
  isInteractive,
}: Props) => {
  return (
    <>
      {sections.map(({ name, data = {}, $componentKey }, index) => {
        const key = $componentKey ?? name // Changes need to made here:
        // [X] 1. The `section.name` being should be replaced by `$componentKey`
        // 2. Find every reference of the `COMPONENTS` list and change the index
        //    from just the component name to the component's `$componentKey`.
        // 3. Every component that is configured via CMS, needs to have the
        //    `$componentKey` property added to it.
        const Component = components[key]

        if (!Component) {
          // TODO: add a documentation link to help to do this
          console.warn(
            `${key} not found. Add a new component for this section or remove it from the CMS`
          )

          return null
        }

        return (
          <SectionBoundary key={`cms-section-${name}-${index}`} name={name}>
            {data.skipLazyLoadingSection ? (
              <Component {...data} />
            ) : (
              <LazyLoadingSection
                sectionName={name}
                isInteractive={isInteractive}
              >
                <Component {...data} />
              </LazyLoadingSection>
            )}
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

  const { isInteractive } = useTTI()

  return (
    <>
      {firstSections && (
        <RenderSectionsBase
          sections={firstSections}
          components={components}
          isInteractive={isInteractive}
        />
      )}
      {sections && sections.length > 0 && (
        <RenderSectionsBase
          sections={sections}
          components={components}
          isInteractive={isInteractive}
        />
      )}
      {children}
      <LazyLoadingSection sectionName="Toast" isInteractive={isInteractive}>
        <Toast />
      </LazyLoadingSection>

      {lastSections && (
        <RenderSectionsBase
          sections={lastSections}
          components={components}
          isInteractive={isInteractive}
        />
      )}
    </>
  )
}

export default memo(RenderSections)
