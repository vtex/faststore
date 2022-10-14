import type { ElementType } from 'react'

import styles from './sr-only.module.scss'

interface Props {
  text: string
  as?: ElementType
}

function SROnly({ text, as }: Props) {
  const Component = as ?? 'span'

  return (
    <Component className={styles.fsSrOnly} data-fs-sr-only>
      {text}
    </Component>
  )
}

export default SROnly
