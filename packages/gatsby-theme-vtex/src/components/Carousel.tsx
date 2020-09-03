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
  ResponsiveImage,
  IResponsiveImage,
} from '@vtex/store-ui'

export interface Item extends IResponsiveImage {
  href: string
}

interface Props {
  items: Item[]
  loading?: 'lazy' | 'eager'
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

// "next()" function makes the index value be always smaller than total,
// so the naive "previous()" implementation will always return a value
// within the array ranges
const next = (index: number, total: number) => (index + 1) % total
const previous = (index: number, total: number) => total - index

const Carousel: FC<Props> = ({
  items,
  loading = 'eager',
  showArrows = true,
  showDots = true,
  autoplayTimeout = 1000,
  autoplay = false,
}) => {
  const { formatMessage } = useIntl()
  const [index, setIndex] = useState(0)
  const item = items[index]

  // TODO: When implementing the Slider, use a timeout instead to improve UX
  useInterval(() => {
    if (!autoplay) {
      return
    }

    setIndex((it) => next(it, items.length))
  }, autoplayTimeout)

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        key={item.alt}
        sx={{
          height: '100%',
        }}
      >
        {showArrows && (
          <Button
            onClick={() => setIndex(previous(index, items.length))}
            sx={{ position: 'absolute', top: '50%', left: 0 }}
          >
            {formatMessage({ id: 'carousel.previous' })}
          </Button>
        )}
        {showArrows && (
          <Button
            onClick={() => setIndex(next(index, items.length))}
            sx={{ position: 'absolute', top: '50%', right: 0 }}
          >
            {formatMessage({ id: 'carousel.next' })}
          </Button>
        )}
        <LocalizedLink to={item.href}>
          <ResponsiveImage {...item} loading={loading} />
        </LocalizedLink>
      </Box>
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
