/** @jsx jsx */
import { FC, useState } from 'react'
import { Box, Button, jsx, Image, PaginationDots } from '@vtex/store-ui'

interface Item {
  src: string
  altText: string
  href?: string
}

interface Props {
  items: Item[]
  showArrows?: boolean
  showDots?: boolean
}

const Carousel: FC<Props> = ({ items, showArrows = true, showDots = true }) => {
  const [index, setIndex] = useState(0)
  const lastIndex = items.length - 1
  const height = 450

  return (
    <Box sx={{ position: 'relative' }}>
      {items.map((item, i) => (
        <Box
          key={item.altText}
          sx={{ display: index === i ? 'block' : 'none', height }}
        >
          {showArrows && (
            <Button
              onClick={() => setIndex(i === 0 ? lastIndex : i - 1)}
              sx={{ position: 'absolute', top: '50%', left: 0 }}
            >
              Previous
            </Button>
          )}
          {showArrows && (
            <Button
              onClick={() => setIndex(i === lastIndex ? 0 : i + 1)}
              sx={{ position: 'absolute', top: '50%', right: 0 }}
            >
              Next
            </Button>
          )}
          <Image
            src={item.src}
            alt={item.altText}
            loading="lazy"
            sx={{ height, width: '100%', objectFit: 'cover' }}
          />
        </Box>
      ))}
      {showDots && (
        <PaginationDots
          variant="carousel"
          totalItems={items.length}
          selectedIndex={index}
          onSelect={setIndex}
        />
      )}
    </Box>
  )
}

export default Carousel
