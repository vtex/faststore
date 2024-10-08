import { ComponentType, PropsWithChildren, memo, useMemo } from 'react'

import SectionBoundary from './SectionBoundary'
import { Section } from '@vtex/client-cms'

interface Props {
  components: Record<string, ComponentType<any>>
  sections: Array<{ name: string; data: any }>
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
