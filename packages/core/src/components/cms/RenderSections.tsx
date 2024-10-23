import {
  ComponentType,
  PropsWithChildren,
  ReactNode,
  memo,
  useMemo,
} from 'react'

import { Section } from '@vtex/client-cms'
import SectionBoundary from './SectionBoundary'
import ViewportObserver from './ViewportObserver'

import { useUI } from '@faststore/ui'

interface Props {
  components: Record<string, ComponentType<any>>
  sections: Array<{ name: string; data: any }>
}

const SECTIONS_OUT_OF_VIEWPORT = ['CartSidebar', 'RegionModal']

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
 * @returns
 */
export const LazyLoadingSection = ({
  sectionName,
  children,
}: {
  sectionName: string
  children: ReactNode
}) => {
  const { cart: displayCart, modal: displayModal } = useUI()

  if (SECTIONS_OUT_OF_VIEWPORT.includes(sectionName)) {
    const shouldLoad =
      (sectionName === 'CartSidebar' && displayCart) ||
      (sectionName === 'RegionModal' && displayModal)
    if (!shouldLoad) {
      return null
    }

    return <>{children}</>
  }
  return (
    <ViewportObserver sectionName={sectionName}>{children}</ViewportObserver>
  )
}

const RenderSectionsBase = ({ sections = [], components }: Props) => {
  return (
    <>
      {sections.map(({ name, data }, index) => {
        const Component = components[name]

        if (!Component) {
          // TODO: add a documentation link to help to do this
          console.warn(
            `${name} not found. Add a new component for this section or remove it from the CMS`
          )

          return null
        }

        return (
          <SectionBoundary key={`cms-section-${index}`} name={name}>
            <Component {...data} />
          </SectionBoundary>
        )
      })}
    </>
  )
}

function RenderSections({
  children,
  sections,
  ...otherProps
}: PropsWithChildren<Props>) {
  const { hasChildren, firstSections, lastSections } =
    useDividedSections(sections)

  return (
    <>
      <RenderSectionsBase sections={firstSections} {...otherProps} />

      {children}

      {hasChildren && (
        <RenderSectionsBase sections={lastSections} {...otherProps} />
      )}
    </>
  )
}

export default memo(RenderSections)
