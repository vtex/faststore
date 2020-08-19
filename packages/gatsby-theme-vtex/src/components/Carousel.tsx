/** @jsx jsx */
import { FC, useState, useMemo } from 'react'
import { useLocalizationIntl } from '@vtex/gatsby-plugin-i18n'
import {
  Box,
  Button,
  jsx,
  Image,
  PaginationDots,
  useInterval,
} from '@vtex/store-ui'

interface Item {
  src: string
  altText: string
  width: number
  height: number
  href?: string
}

interface Props {
  items: Item[]
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

const Carousel: FC<Props> = ({
  items,
  showArrows = true,
  showDots = true,
  autoplayTimeout = 1000,
  autoplay = false,
}) => {
  const { formatMessage } = useLocalizationIntl()
  const [index, setIndex] = useState(0)
  const lastIndex = useMemo(() => items.length - 1, [items])

  useInterval(() => {
    if (!autoplay) {
      return
    }

    setIndex((currentIndex) =>
      currentIndex === lastIndex ? 0 : currentIndex + 1
    )
  }, autoplayTimeout)

  return (
    <Box sx={{ position: 'relative' }}>
      {items.map((item, i) => (
        <Box
          key={item.altText}
          sx={{ display: index === i ? 'block' : 'none' }}
        >
          {showArrows && (
            <Button
              onClick={() => setIndex(i === 0 ? lastIndex : i - 1)}
              sx={{ position: 'absolute', top: '50%', left: 0 }}
            >
              {formatMessage({ id: 'carousel.previous' })}
            </Button>
          )}
          {showArrows && (
            <Button
              onClick={() => setIndex(i === lastIndex ? 0 : i + 1)}
              sx={{ position: 'absolute', top: '50%', right: 0 }}
            >
              {formatMessage({ id: 'carousel.next' })}
              Next
            </Button>
          )}
          <Image
            src={item.src}
            width={item.width}
            height={item.height}
            alt={item.altText}
            loading={i === 0 ? 'eager' : 'lazy'}
            sx={{ width: '100%', objectFit: 'cover' }}
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
