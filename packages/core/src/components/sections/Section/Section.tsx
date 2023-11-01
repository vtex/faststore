import { forwardRef } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import { useOverrideId } from 'src/sdk/overrides/OverrideContext'

type BaseProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

type SectionProps = BaseProps & {
  as?: 'section' | 'header' | 'footer' | 'aside'
}

const Section = forwardRef<HTMLDivElement, SectionProps>(function Section(
  { as, className = '', ...otherProps },
  ref
) {
  const id = useOverrideId()
  const Component = as ?? 'section'

  return (
    <Component
      ref={ref}
      className={`section ${className}`}
      {...otherProps}
      data-override-id={id}
    />
  )
})

export default Section
