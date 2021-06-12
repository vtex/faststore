import React from 'react'
import { AspectImage, Box } from 'theme-ui'
import type { FC } from 'react'

import YoutubeThumb from '../../Youtube/Thumb'
import type { Item } from '../Page'

interface Props {
  variant: string
  selectedPage: number
  allItems: Item[]
  onSelect: (index: number) => void
}

const Miniatures: FC<Props> = ({
  variant,
  onSelect,
  allItems,
  selectedPage,
}) => (
  <>
    {allItems.map((item, index) => (
      <Box
        key={`miniatures-${index}`}
        variant={`${variant}.miniature.${
          selectedPage === index ? 'active' : 'inactive'
        }`}
        onClick={() => onSelect(index)}
      >
        {item.type === 'image' ? (
          <AspectImage ratio={1} {...item.props} {...item.props.targetProps} />
        ) : (
          // TODO: Figure out a way of supporting other platforms, like vimeo
          <YoutubeThumb src={item.props.src} variant={variant} />
        )}
      </Box>
    ))}
  </>
)

export default Miniatures
