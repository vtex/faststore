import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  memo,
  useMemo,
} from 'react'

import { useUI } from '@faststore/ui'
import { Section } from '@vtex/client-cms'
import dynamic from 'next/dynamic'
import Intersection from './Intersection'
import SectionBoundary from './SectionBoundary'
import COMPONENTS from './global/Components'

interface Props {
  components?: Record<string, ComponentType<any>>
  globalSections?: Array<{ name: string; data: any }>
  sections: Array<{ name: string; data: any }>
}

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

// PSI - lazy loading components that are out of viewport
const OUT_OF_VIEWPORT_SECTIONS = ['CartSidebar', 'RegionModal']

/**
 * This component is responsible for lazy loading Sections that are out of the viewport.
 * by using the IntersectionObserver API for Sections below the fold OR
 * by checking the UI context for Sections that are not in the viewport, like the CartSidebar or regionModal.
 *
 * @param name
 * @returns
 */
export const LazyLoadingSection = ({
  name,
  children,
}: {
  name: string
  children: ReactNode
}) => {
  const { cart: displayCart, modal: displayModal } = useUI()

  if (OUT_OF_VIEWPORT_SECTIONS.includes(name)) {
    const shouldLoad =
      (name === 'CartSidebar' && displayCart) ||
      (name === 'RegionModal' && displayModal)
    return shouldLoad ? <>{children}</> : null
  } else {
    return <Intersection name={name}>{children}</Intersection>
  }
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
            <LazyLoadingSection name={name}>
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
      <LazyLoadingSection name="Toast">
        <Toast />
      </LazyLoadingSection>

      {lastSections && (
        <RenderSectionsBase sections={lastSections} components={components} />
      )}
    </>
  )
}

export default memo(RenderSections)
