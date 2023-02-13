import { forwardRef } from 'react'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type Props = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

const Section = forwardRef<HTMLDivElement, Props>(function Section(
  { className = '', ...otherProps },
  ref
) {
  return (
    <section ref={ref} className={`section ${className}`} {...otherProps} />
  )
})

export default Section
