import { useRef, useEffect } from 'react'

export interface UseSlideVisibilityArgs {
  currentSlide: number
  itemsPerPage: number
  totalItems: number
}

interface IsSlideVisibleArgs {
  itemsPerPage: number
  currentSlide: number
  slideIdx: number
  totalItems: number
}

function isSlideVisible({
  itemsPerPage,
  currentSlide,
  slideIdx,
  totalItems,
}: IsSlideVisibleArgs) {
  const isClonedSlide = currentSlide < 0 || currentSlide >= totalItems
  const isVisible =
    slideIdx >= currentSlide && slideIdx < currentSlide + itemsPerPage

  return isClonedSlide || isVisible
}

export const useSlideVisibility = ({
  currentSlide,
  itemsPerPage,
  totalItems,
}: UseSlideVisibilityArgs) => {
  /** Keeps track of slides that have been visualized before.
   * We want to keep rendering them because the issue is mostly rendering
   * slides that might never be viewed; On the other hand, hiding slides
   * that were visible causes visual glitches */
  const visitedSlides = useRef<Set<number>>(new Set())

  useEffect(() => {
    for (let i = 0; i < itemsPerPage; i++) {
      visitedSlides.current.add(currentSlide + i)
    }
  }, [currentSlide, itemsPerPage])

  const isItemVisible = (index: number) =>
    isSlideVisible({
      slideIdx: index,
      currentSlide,
      itemsPerPage,
      totalItems,
    })

  const shouldRenderItem = (index: number) => {
    return visitedSlides.current.has(index) || isItemVisible(index)
  }

  return { shouldRenderItem, isItemVisible }
}
