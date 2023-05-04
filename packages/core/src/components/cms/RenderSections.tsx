import chalk from 'chalk'
import { ComponentType } from 'react'

import SectionBoundary from './SectionBoundary'

interface Props {
  components: Record<string, ComponentType<any>>
  sections: Array<{ name: string; data: any }>
  context?: unknown
}

const RenderSections = ({ sections = [], context, components }: Props) => {
  return (
    <>
      {sections.map(({ name, data }, index) => {
        const Component = components[name]

        if (!Component) {
          // TODO: add a documentation link to help to do this
          console.info(
            `${chalk.yellow(
              'warn'
            )} - ${name} not found. Add a new component for this section or remove it from the CMS`
          )

          return null
        }

        return (
          <SectionBoundary key={`cms-section-${index}`} name={name}>
            <Component {...data} context={context} />
          </SectionBoundary>
        )
      })}
    </>
  )
}

export default RenderSections
