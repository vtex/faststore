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
import { Helmet } from 'react-helmet'

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
      {
        // Adds a <link rel="preload"/> to decrease LCP metric
        loading === 'eager'
          ? item.sources.map((source) => (
              <Helmet
                key={source.srcSet}
                link={[
                  {
                    rel: 'preload',
                    href: source.srcSet,
                    media: source.media,
                  },
                ]}
              />
            ))
          : null
      }
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
      <LocalizedLink key={item.href} to={item.href}>
        <ResponsiveImage {...item} loading={loading} />
      </LocalizedLink>
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
