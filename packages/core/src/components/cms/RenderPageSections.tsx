/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from 'react'

import SectionBoundary from './SectionBoundary'

interface Props {
  components: Record<string, ComponentType<any>>
  sections: Array<{ name: string; data: any }>
  context?: unknown
}

const RenderPageSections = ({ sections = [], context, components }: Props) => (
  <>
    {sections.map(({ name, data }, index) => {
      const Component = components[name]

      if (!Component) {
        console.info(
          `Could not find component for block ${name}. Add a new component for this block or remove it from the CMS`
        )

        return <></>
      }

      return (
        <SectionBoundary key={`cms-section-${index}`} name={name}>
          <Component {...data} context={context} />
        </SectionBoundary>
      )
    })}
  </>
)

export default RenderPageSections
