import { ComponentType, PropsWithChildren, memo, useMemo } from 'react'

import { Section } from '@vtex/client-cms'
import dynamic from 'next/dynamic'
import COMPONENTS from './Components'
import Intersection from './Intersection'
import SectionBoundary from './SectionBoundary'

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

const RenderSectionsBase = ({
  sections = [],
  components = COMPONENTS,
}: Props) => {
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
            <Intersection>
              <Component {...data} />
            </Intersection>
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
      {sections && (
        <RenderSectionsBase sections={sections} components={components} />
      )}
      {children}
      {lastSections && (
        <RenderSectionsBase sections={lastSections} components={components} />
      )}
      <Toast />
    </>
  )
}

export default memo(RenderSections)
