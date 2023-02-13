import { Tiles as UITiles } from '@faststore/ui'

import type { TilesProps } from '.'
import styles from './tiles.module.scss'

const Tiles = ({ children, ...otherProps }: TilesProps) => {
  return (
    <UITiles className={styles.fsTiles} {...otherProps}>
      {children}
    </UITiles>
  )
}

export default Tiles
