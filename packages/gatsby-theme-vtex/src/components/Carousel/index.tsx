/** @jsx jsx */
import { FC } from 'react'
import { useIntl } from '@vtex/gatsby-plugin-i18n'
import {
  Box,
  jsx,
  useSlider,
  LocalizedLink,
  ResponsiveImage,
  IResponsiveImage,
} from '@vtex/store-ui'

import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import PaginationDots from './PaginationDots'

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
    pageSize: 1,
    autoplay,
    autoplayTimeout,
  })

  // this is safe, since there is only one item per page
  const [item] = items

  return (
    <Box sx={{ position: 'relative' }}>
      {showArrows && (
        <ArrowLeft onClick={() => setPreviousPage()}>
          {formatMessage({ id: 'carousel.previous' })}
        </ArrowLeft>
      )}
      {showArrows && (
        <ArrowRight onClick={() => setNextPage()}>
          {formatMessage({ id: 'carousel.next' })}
        </ArrowRight>
      )}
      <LocalizedLink key={item.href} to={item.href}>
        <ResponsiveImage {...item} loading={loading} />
      </LocalizedLink>
      {showDots && (
        <PaginationDots
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
