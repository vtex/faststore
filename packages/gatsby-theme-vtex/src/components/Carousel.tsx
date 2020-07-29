import React, { FC, useState } from 'react'
import Box from '@material-ui/core/Box'

import Button from './material-ui-components/Button'

interface Item {
  src: string
  altText: string
  href?: string
}

interface Props {
  items: Item[]
}

const Carousel: FC<Props> = ({ items }) => {
  const [index, setIndex] = useState(0)
  const lastIndex = items.length - 1
  const height = 450

  return (
    <Box position="relative">
      {items.map((item, i) => (
        <Box
          height={height}
          key={item.altText}
          display={index === i ? 'block' : 'none'}
        >
          <Button
            onClick={() => {
              console.log('carousel prev button clicked')
              setIndex(i === 0 ? lastIndex : i - 1)
            }}
            style={{ position: 'absolute', top: '50%', left: 0 }}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              console.log('carousel next button clicked')
              setIndex(i === lastIndex ? 0 : i + 1)
            }}
            style={{ position: 'absolute', top: '50%', right: 0 }}
          >
            Next
          </Button>
          <img
            src={item.src}
            alt={item.altText}
            loading="lazy"
            style={{ height, width: '100%', objectFit: 'cover' }}
          />
        </Box>
      ))}
    </Box>
  )
}

export default Carousel
