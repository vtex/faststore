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
import { useRouter } from 'next/router'
import useTTI from 'src/sdk/performance/useTTI'
import { isContentPlatformSource } from 'src/server/content/utils'
import COMPONENTS from './global/Components'
import SectionBoundary from './SectionBoundary'
import ViewportObserver from './ViewportObserver'

interface Props {
  components?: Record<string, ComponentType<any>>
  globalSections?: Array<{ name: string; data: any }>
  sections?: Array<{ name: string; data: any; $componentKey?: string }>
  isInteractive?: boolean
}

const REGION_SLIDER_SECTION_NAME = 'RegionSlider'

const SECTIONS_OUT_OF_VIEWPORT = [
  'CartSidebar',
  'RegionModal',
  REGION_SLIDER_SECTION_NAME,
]

/**
 * Ensure a RegionSlider section exists in the iteration. After PR #2961 the
 * section was removed from `sections.json`, so CP-based stores (whose CP
 * schemas were generated in PR #3071) and fresh hCMS stores no longer have it
 * in their CMS content. The runtime still expects the section to flow through
 * `RenderSections` so that `LazyLoadingSection` can gate the lazy import on
 * `regionSlider.isOpen`. Inject the entry only if it is not already present in
 * `sections` or `globalSections` to avoid double-rendering for legacy hCMS
 * stores that have it persisted in their CMS.
 */
function withRegionSliderSection(
  sections: Section[] | undefined,
  globalSections: Section[] | undefined
): Section[] {
  const base = sections ?? []
  const isPresent =
    base.some(({ name }) => name === REGION_SLIDER_SECTION_NAME) ||
    globalSections?.some(({ name }) => name === REGION_SLIDER_SECTION_NAME)

  if (isPresent) return base

  return [...base, { name: REGION_SLIDER_SECTION_NAME, data: {} }]
}

const Toast = dynamic(
  () => import(/* webpackChunkName: "Toast" */ '../common/Toast'),
  { ssr: false }
)

const PreviewTag = dynamic(
  () => import(/* webpackChunkName: "PreviewTag" */ '../common/PreviewTag'),
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
  const { cart: displayCart, modal: displayModal, regionSlider } = useUI()

  if (SECTIONS_OUT_OF_VIEWPORT.includes(sectionName)) {
    const shouldLoad =
      isInteractive ||
      (sectionName === 'CartSidebar' && displayCart) ||
      (sectionName === 'RegionModal' && displayModal) ||
      (sectionName === 'RegionSlider' &&
        regionSlider.isOpen &&
        regionSlider.type !== 'none')

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
        const key = $componentKey ?? name
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

  const augmentedSections = useMemo(
    () => withRegionSliderSection(sections, globalSections),
    [sections, globalSections]
  )

  const { isInteractive } = useTTI()
  const router = useRouter()

  const shouldDisplayPreviewTag = isContentPlatformSource() && router.isPreview

  return (
    <>
      {shouldDisplayPreviewTag && (
        <LazyLoadingSection
          sectionName="PreviewTag"
          isInteractive={isInteractive}
        >
          <PreviewTag />
        </LazyLoadingSection>
      )}
      {firstSections && (
        <RenderSectionsBase
          sections={firstSections}
          components={components}
          isInteractive={isInteractive}
        />
      )}
      {augmentedSections.length > 0 && (
        <RenderSectionsBase
          sections={augmentedSections}
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
