import type { ElementType } from 'react'

interface Props {
  text: string
  as?: ElementType
}

function SROnly({ text, as }: Props) {
  const Component = as ?? 'span'

  return <Component data-store-sr-only>{text}</Component>
}

export default SROnly
