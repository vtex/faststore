import React from 'react'
import type { ElementType } from 'react'

interface SROnlyProps {
  text: string
  as?: ElementType
}

function SROnly({ text, as }: SROnlyProps) {
  const Component = as ?? 'span'

  return <Component data-fs-sr-only>{text}</Component>
}

export default SROnly
