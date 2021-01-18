import React from 'react'
import type { FC } from 'react'
import { ThemeProvider } from 'theme-ui'
import type { Theme } from 'theme-ui'

import baseTheme from '../theme'
import allItems from './fixtures/items'
import { Box, useSlider } from '../../index'
import CarouselArrowLeft from '../ArrowLeft'
import CarouselArrowRight from '../ArrowRight'
import CarouselPage from '../Page'
import CarouselPaginationDots from '../PaginationDots'
import type { Item } from '../Page'

const Link: FC = ({ children }) => (
  <a href="#/" target="_blank">
    {children}
  </a>
)

export const Default = () => {
  const {
    page,
    items,
    totalPages,
    setPage,
    setNextPage,
    setPreviousPage,
    dragHandlers,
  } = useSlider({
    allItems,
    pageSize: 1,
    autoplay: 5500,
  })

  const item = items[0] as Item

  return (
    <ThemeProvider theme={{ ...baseTheme } as Theme}>
      <Box variant="carousel">
        <Box variant="carousel.group" {...dragHandlers}>
          <CarouselArrowLeft
            variant="carousel"
            onClick={() => setPreviousPage()}
          />
          <CarouselPage
            variant="carousel"
            item={item}
            height="540px"
            width="360px"
            loading="eager"
            link={Link}
          />
          <CarouselArrowRight
            variant="carousel"
            onClick={() => setNextPage()}
          />
        </Box>
        <CarouselPaginationDots
          variant="carousel"
          onSelect={setPage}
          selectedPage={page}
          totalPages={totalPages}
        />
      </Box>
    </ThemeProvider>
  )
}

export default {
  title: 'product|Carousel',
  component: Default,
}
