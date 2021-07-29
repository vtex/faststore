import { renderHook, act } from '@testing-library/react-hooks'

import useCarousel from './useCarousel'
import useSlideVisibility from './useSlideVisibility'
import type { UseSlideVisibilityArgs } from './useSlideVisibility'

describe('useCarousel', () => {
  it('should initialize carouselState correctly', () => {
    const expectedCarouselState = {
      currentSlide: 0,
      currentPage: 0,
      sliding: false,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    }

    const { result: returnValue } = renderHook(() =>
      useCarousel({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const receivedCarouselState = returnValue.current.carouselState

    expect(receivedCarouselState).toEqual(expectedCarouselState)
  })

  it('should go to next page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useCarousel({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const finalState = {
      currentSlide: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    }

    const { carouselDispatch } = result.current

    act(() => {
      carouselDispatch({ type: 'NEXT_PAGE' })
    })

    expect(result.current.carouselState).toEqual(finalState)
  })

  it('should go to previous page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useCarousel({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const { carouselDispatch } = result.current

    act(() => {
      carouselDispatch({ type: 'PREVIOUS_PAGE' })
    })

    expect(result.current.carouselState).toEqual({
      currentSlide: 4,
      currentPage: 2,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })

    act(() => {
      carouselDispatch({ type: 'PREVIOUS_PAGE' })
    })

    expect(result.current.carouselState).toEqual({
      currentSlide: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })
  })

  it('should go to a certain page and update state accordingly', () => {
    const { result } = renderHook(() =>
      useCarousel({
        totalItems: 5,
        itemsPerPage: 2,
      })
    )

    const { carouselDispatch } = result.current

    act(() => {
      carouselDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 1,
        },
      })
    })

    expect(result.current.carouselState).toEqual({
      currentSlide: 2,
      currentPage: 1,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })

    act(() => {
      carouselDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 2,
        },
      })
    })

    expect(result.current.carouselState).toEqual({
      currentSlide: 4,
      currentPage: 2,
      sliding: true,
      slideDirection: 'next',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })

    act(() => {
      carouselDispatch({
        type: 'GO_TO_PAGE',
        payload: {
          pageIndex: 0,
        },
      })
    })

    expect(result.current.carouselState).toEqual({
      currentSlide: 0,
      currentPage: 0,
      sliding: true,
      slideDirection: 'previous',
      totalItems: 5,
      itemsPerPage: 2,
      totalPages: 3,
    })
  })
})

describe('useSlideVisibility', () => {
  /**
   * Let's assume we're working with an hypothetical carousel that has 10 items
   * and displays 3 of them per page in all of the tests below.
   */
  const slideIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

  describe('shouldRenderItem function', () => {
    it('should return `true` for slides that have been seen across state updates', () => {
      const { result, rerender } = renderHook(
        (props: UseSlideVisibilityArgs) =>
          useSlideVisibility({
            currentSlide: props.currentSlide,
            itemsPerPage: props.itemsPerPage,
          }),
        { initialProps: { currentSlide: 0, itemsPerPage: 3 } }
      )

      let currentResultsArray = slideIndexes.map((index) =>
        result.current.shouldRenderItem(index)
      )

      // The first three values in the resulting array should be `true`.
      const firstExpectedTruthyValues = currentResultsArray
        .slice(0, 3)
        .filter((item) => Boolean(item))

      expect(firstExpectedTruthyValues).toHaveLength(3)

      // This represents the carousel currently in the second page.
      rerender({ currentSlide: 3, itemsPerPage: 3 })

      currentResultsArray = slideIndexes.map((index) =>
        result.current.shouldRenderItem(index)
      )

      // The first six values in the resulting array should be `true`.
      const secondExpectedTruthyValues = currentResultsArray
        .slice(0, 6)
        .filter((item) => Boolean(item))

      expect(secondExpectedTruthyValues).toHaveLength(6)

      // This represents the carousel currently in the first page again.
      rerender({ currentSlide: 0, itemsPerPage: 3 })

      currentResultsArray = slideIndexes.map((index) =>
        result.current.shouldRenderItem(index)
      )

      // The first six values in the resulting array should be `true`,
      // same as the previous test.
      const thirdExpectedTruthyValues = currentResultsArray
        .slice(0, 6)
        .filter((item) => Boolean(item))

      expect(thirdExpectedTruthyValues).toHaveLength(6)
    })
  })

  describe('isItemVisible function', () => {
    it('should return `true` for slides that are currently visible given a certain state', () => {
      const { result, rerender } = renderHook(
        (props: UseSlideVisibilityArgs) =>
          useSlideVisibility({
            currentSlide: props.currentSlide,
            itemsPerPage: props.itemsPerPage,
          }),
        { initialProps: { currentSlide: 0, itemsPerPage: 3 } }
      )

      let currentResultsArray = slideIndexes.map((index) =>
        result.current.isItemVisible(index)
      )

      // The first three values in the resulting array should be `true`.
      const firstExpectedTruthyValues = currentResultsArray
        .slice(0, 3)
        .filter((item) => Boolean(item))

      expect(firstExpectedTruthyValues).toHaveLength(3)

      // This represents the carousel currently in the second page.
      rerender({ currentSlide: 3, itemsPerPage: 3 })

      currentResultsArray = slideIndexes.map((index) =>
        result.current.isItemVisible(index)
      )

      // The elements at indexes 3, 4 and 5 in the resulting array should be
      // `true`.
      const secondExpectedTruthyValues = currentResultsArray
        .slice(3, 6)
        .filter((item) => Boolean(item))

      const truthyValues = currentResultsArray.filter((item) => Boolean(item))

      expect(secondExpectedTruthyValues).toHaveLength(3)
      expect(truthyValues).toHaveLength(3)
    })
  })
})
