/** @jsx jsx */
import { FC, useState } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import {
  Box,
  Button,
  jsx,
  PaginationDots,
  useInterval,
  LocalizedLink,
} from '@vtex/store-ui'

interface Source {
  srcSet: string
  sizes?: string
}

export interface Picture {
  sources: [Source, Source]
  heights: [string, string]
  alt: string
  src?: string
  href?: string
}

interface Props {
  items: Picture[]
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
  const { formatMessage } = useIntl()
  const [index, setIndex] = useState(0)
  const lastIndex = items.length - 1

  // TODO: When implementing the Slider, use a timeout instead to improve UX
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
          key={item.alt}
          sx={{
            display: index === i ? 'block' : 'none',
            height: '100%',
          }}
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
            </Button>
          )}
          <LocalizedLink to={item.href ?? '/'}>
            <picture>
              <source media="(max-width: 500px)" {...item.sources[0]} />
              <source media="(min-width: 501px)" {...item.sources[1]} />
              <img
                src={item.src}
                alt={item.alt}
                sx={{
                  height: item.heights,
                  objectFit: 'cover',
                  width: '100%',
                }}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </picture>
          </LocalizedLink>
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
