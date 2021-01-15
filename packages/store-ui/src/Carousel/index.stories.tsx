import React from 'react'
import type { FC } from 'react'
import { ThemeProvider } from 'theme-ui'
import type { Theme } from 'theme-ui'

import baseTheme from './theme'
import allItems from './items'
import {
  CarouselArrowLeft,
  CarouselArrowRight,
  CarouselPage,
  CarouselPaginationDots,
} from './index'
import type { Item } from './index'
import { Box, useSlider } from '../index'

const Link: FC = ({ children }) => <a href="/">{children}</a>

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
            width="238px"
            height="360px"
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
