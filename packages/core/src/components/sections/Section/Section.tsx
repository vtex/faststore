import { forwardRef } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type BaseProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

type SectionProps = BaseProps & {
  as?: 'section' | 'header' | 'footer' | 'aside'
  title?: string
}

const Section = forwardRef<HTMLDivElement, SectionProps>(function Section(
  { as, className = '', title, children, ...otherProps },
  ref
) {
  const Component = as ?? 'section'

  return (
    <Component ref={ref} className={`section ${className}`} {...otherProps}>
      {title && (
        <h2 className="text__title-section layout__content">{title}</h2>
      )}
      {children}
    </Component>
  )
})

export default Section
