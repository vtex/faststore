import { forwardRef } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type BaseProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

type SectionProps = BaseProps & {
  as?: 'section' | 'header' | 'footer' | 'aside'
}

const Section = forwardRef<HTMLDivElement, SectionProps>(function Section(
  { as, className = '', ...otherProps },
  ref
) {
  const Component = as ?? 'section'

  return (
    <Component ref={ref} className={`section ${className}`} {...otherProps} />
  )
})

export default Section
