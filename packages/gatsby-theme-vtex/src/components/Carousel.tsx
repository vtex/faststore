/** @jsx jsx */
import { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import {
  Box,
  Button,
  jsx,
  SliderPaginationDots,
  useSlider,
  LocalizedLink,
  ResponsiveImage,
  IResponsiveImage,
} from '@vtex/store-ui'

export interface Item extends IResponsiveImage {
  href: string
}

interface Props {
  allItems: Item[]
  loading?: 'lazy' | 'eager'
  showArrows?: boolean
  showDots?: boolean
  autoplay?: boolean
  autoplayTimeout?: number
}

const Carousel: FC<Props> = ({
  allItems,
  loading = 'eager',
  showArrows = true,
  showDots = true,
  autoplay,
  autoplayTimeout,
}) => {
  const { formatMessage } = useIntl()
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
  } = useSlider({
    allItems,
    autoplay,
    autoplayTimeout,
  })

  return (
    <Box sx={{ position: 'relative' }}>
      {showArrows && (
        <Button
          onClick={() => setPreviousPage()}
          sx={{ position: 'absolute', top: '50%', left: 0, zIndex: 1 }}
        >
          {formatMessage({ id: 'carousel.previous' })}
        </Button>
      )}
      {showArrows && (
        <Button
          onClick={() => setNextPage()}
          sx={{ position: 'absolute', top: '50%', right: 0, zIndex: 1 }}
        >
          {formatMessage({ id: 'carousel.next' })}
        </Button>
      )}
      {items.map((item) => (
        <LocalizedLink key={item.href} to={item.href}>
          <ResponsiveImage {...item} loading={loading} />
        </LocalizedLink>
      ))}
      {showDots && (
        <SliderPaginationDots
          variant="carousel"
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      )}
    </Box>
  )
}

export default Carousel
