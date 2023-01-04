import React from 'react'

import { Tile, Tiles as UITiles } from '../'
import mdx from './Tiles.mdx'

import type { Story, Meta } from '@storybook/react'
import type { TilesProps } from '../'

const TilesTemplate: Story<TilesProps> = () => (
  <>
    <UITiles>
      <Tile>Tile #1</Tile>
      <Tile>Tile #2</Tile>
    </UITiles>
    <UITiles>
      <Tile>Tile #1</Tile>
      <Tile>Tile #2</Tile>
      <Tile>Tile #3</Tile>
      <Tile>Tile #4</Tile>
    </UITiles>
    <UITiles>
      <Tile>Tile #1</Tile>
      <Tile>Tile #2</Tile>
      <Tile>Tile #3</Tile>
    </UITiles>
  </>
)

export const Tiles = TilesTemplate.bind({})

export default {
  title: 'Organisms/Tiles',
  parameters: {
    docs: {
      page: mdx,
    },
  },
} as Meta
