import type { ElementType } from 'react'

interface SROnlyProps {
  /**
   * Defines component element type (e.g.: span).
   */
  text: string
  /**
   * Defines component element type (e.g.: span).
   */
  as?: ElementType
}

export default function SROnly({ text, as }: SROnlyProps) {
  const Component = as ?? 'span'

  return <Component data-fs-sr-only>{text}</Component>
}
