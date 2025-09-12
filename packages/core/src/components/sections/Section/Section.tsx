import type { DetailedHTMLProps, HTMLAttributes } from 'react'

import { useOverrideClassName } from '../../../sdk/overrides/OverrideContext'

type BaseProps = DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

type SectionProps = BaseProps & {
  as?: 'section' | 'header' | 'footer' | 'aside'
}

export default function Section({
  as,
  className = '',
  ref,
  ...otherProps
}: SectionProps) {
  const overrideClassName = useOverrideClassName() ?? ''
  const Component = as ?? 'section'

  return (
    <Component
      ref={ref}
      className={`section ${className} ${overrideClassName}`.trim()}
      {...otherProps}
    />
  )
}
