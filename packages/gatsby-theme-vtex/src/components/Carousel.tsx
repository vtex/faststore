/** @jsx jsx */
import { FC, useState } from 'react'
import { Box, Button, jsx, Image } from '@vtex/store-ui'
import { FormattedMessage } from 'react-intl'
// import { t, store, cache } from 'frenchkiss'

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
    <Box sx={{ position: 'relative' }}>
      {items.map((item, i) => (
        <Box
          key={item.altText}
          sx={{ display: index === i ? 'block' : 'none', height }}
        >
          <Button
            onClick={() => setIndex(i === 0 ? lastIndex : i - 1)}
            sx={{ position: 'absolute', top: '50%', left: 0 }}
          >
            <FormattedMessage id="carousel.previous" />
            {/* <div>{t('carousel.previous')}</div> */}
          </Button>
          <Button
            onClick={() => setIndex(i === lastIndex ? 0 : i + 1)}
            sx={{ position: 'absolute', top: '50%', right: 0 }}
          >
            <FormattedMessage id="carousel.next" />
            {/* <div>{t('carousel.next')}</div> */}
          </Button>
          <Image
            src={item.src}
            alt={item.altText}
            loading="lazy"
            sx={{ height, width: '100%', objectFit: 'cover' }}
          />
        </Box>
      ))}
    </Box>
  )
}

export default Carousel
