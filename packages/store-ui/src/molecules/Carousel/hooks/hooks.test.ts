import { renderHook } from '@testing-library/react-hooks'

import useSlideVisibility from './useSlideVisibility'
import type { UseSlideVisibilityArgs } from './useSlideVisibility'

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
            totalItems: props.totalItems,
          }),
        { initialProps: { currentSlide: 0, itemsPerPage: 3, totalItems: 10 } }
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
      rerender({ currentSlide: 3, itemsPerPage: 3, totalItems: 10 })

      currentResultsArray = slideIndexes.map((index) =>
        result.current.shouldRenderItem(index)
      )

      // The first six values in the resulting array should be `true`.
      const secondExpectedTruthyValues = currentResultsArray
        .slice(0, 6)
        .filter((item) => Boolean(item))

      expect(secondExpectedTruthyValues).toHaveLength(6)

      // This represents the carousel currently in the first page again.
      rerender({ currentSlide: 0, itemsPerPage: 3, totalItems: 10 })

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
            totalItems: props.totalItems,
          }),
        { initialProps: { currentSlide: 0, itemsPerPage: 3, totalItems: 10 } }
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
      rerender({ currentSlide: 3, itemsPerPage: 3, totalItems: 10 })

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
