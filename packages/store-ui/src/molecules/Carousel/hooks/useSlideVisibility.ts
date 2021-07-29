import { useRef, useEffect } from 'react'

export interface UseSlideVisibilityArgs {
  currentSlide: number
  itemsPerPage: number
}

function isSlideVisible({
  itemsPerPage,
  currentSlide,
  slideIdx,
}: {
  itemsPerPage: number
  currentSlide: number
  slideIdx: number
}) {
  return slideIdx >= currentSlide && slideIdx < currentSlide + itemsPerPage
}

export default function useSlideVisibility({
  currentSlide,
  itemsPerPage,
}: UseSlideVisibilityArgs) {
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
    })

  const shouldRenderItem = (index: number) => {
    return visitedSlides.current.has(index) || isItemVisible(index)
  }

  return { shouldRenderItem, isItemVisible }
}
