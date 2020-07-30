import React, { FC, useState } from 'react'

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
  const height = 450

  return (
    <div style={{ position: 'relative' }}>
      <Button
        key="prevClickCarousel"
        onClick={() => {
          setIndex((index + items.length - 1) % items.length)
        }}
        style={{ position: 'absolute', top: '50%', left: 0 }}
      >
        Previous
      </Button>
      <Button
        key="nextClickCarousel"
        onClick={() => {
          setIndex((index + 1) % items.length)
        }}
        style={{ position: 'absolute', top: '50%', right: 0 }}
      >
        Next
      </Button>
      {items.map((item, i) => (
        <div
          key={item.altText}
          style={{ height, display: index === i ? 'block' : 'none' }}
        >
          <img
            src={item.src}
            alt={item.altText}
            loading="lazy"
            style={{ height, width: '100%', objectFit: 'cover' }}
          />
        </div>
      ))}
    </div>
  )
}

export default Carousel
