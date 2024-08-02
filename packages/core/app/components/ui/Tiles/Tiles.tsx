import { Tiles as UITiles } from '@faststore/ui'

import type { TilesProps } from '.'

const Tiles = ({ children, ...otherProps }: TilesProps) => {
  return <UITiles {...otherProps}>{children}</UITiles>
}

export default Tiles
