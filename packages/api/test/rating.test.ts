import { buildRatingDistribution } from '../src/platforms/vtex/utils/rating'
import type { ProductRating as ApiClientProductRating } from '../src/platforms/vtex/clients/commerce/types/ProductRating'

describe('rating', () => {
  describe('buildRatingDistribution', () => {
    it('should return rating with 0 distribution when totalCount is 0', () => {
      const distribution: ApiClientProductRating = {
        average: 0,
        totalCount: 0,
        starsOne: 0,
        starsTwo: 0,
        starsThree: 0,
        starsFour: 0,
        starsFive: 0,
      }

      const result = buildRatingDistribution(distribution)

      expect.assertions(1)

      expect(result).toStrictEqual({
        ratingValue: 0,
        reviewCount: 0,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
        },
      })
    })

    it('should return rating with 100% distribution when only one rating is presented', () => {
      const distribution: ApiClientProductRating = {
        average: 5,
        totalCount: 5,
        starsOne: 0,
        starsTwo: 0,
        starsThree: 0,
        starsFour: 0,
        starsFive: 5,
      }

      const result = buildRatingDistribution(distribution)

      expect.assertions(1)

      expect(result).toStrictEqual({
        ratingValue: 5,
        reviewCount: 5,
        distribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 100,
        },
      })
    })

    it('should calculate distribution when the sum of percentages is exactly 100%', () => {
      const distribution: ApiClientProductRating = {
        average: 3,
        totalCount: 10,
        starsOne: 1,
        starsTwo: 2,
        starsThree: 3,
        starsFour: 2,
        starsFive: 2,
      }

      const result = buildRatingDistribution(distribution)

      expect.assertions(1)

      expect(result).toStrictEqual({
        ratingValue: 3,
        reviewCount: 10,
        distribution: {
          1: 10,
          2: 20,
          3: 30,
          4: 20,
          5: 20,
        },
      })
    })

    it('should increment the most frequent rating when the sum of percentages is less than 100%', () => {
      const distribution: ApiClientProductRating = {
        average: 3.64,
        totalCount: 11,
        starsOne: 1,
        starsTwo: 1,
        starsThree: 3,
        starsFour: 2,
        starsFive: 4,
      }

      const result = buildRatingDistribution(distribution)
      const percentageSum = Object.values(result.distribution).reduce(
        (acc, curr) => acc + curr,
        0
      )

      expect.assertions(2)

      expect(percentageSum).toBe(100)
      expect(result).toStrictEqual({
        ratingValue: 3.64,
        reviewCount: 11,
        distribution: {
          1: 9,
          2: 9,
          3: 27,
          4: 18,
          5: 37,
        },
      })
    })

    it('should decrease the most frequent rating when the sum of percentages is greater than 100%', () => {
      const distribution: ApiClientProductRating = {
        average: 3.5,
        totalCount: 14,
        starsOne: 1,
        starsTwo: 4,
        starsThree: 0,
        starsFour: 5,
        starsFive: 4,
      }

      const result = buildRatingDistribution(distribution)
      const percentageSum = Object.values(result.distribution).reduce(
        (acc, curr) => acc + curr,
        0
      )

      expect.assertions(2)

      expect(percentageSum).toBe(100)
      expect(result).toStrictEqual({
        ratingValue: 3.5,
        reviewCount: 14,
        distribution: {
          1: 7,
          2: 29,
          3: 0,
          4: 35,
          5: 29,
        },
      })
    })

    it('should decrease the most frequent rating with the lower index when the sum of percentages is greater than 100% and there are more than 1 rating with the highest frequency', () => {
      const distribution: ApiClientProductRating = {
        average: 3.43,
        totalCount: 14,
        starsOne: 0,
        starsTwo: 4,
        starsThree: 0,
        starsFour: 5,
        starsFive: 5,
      }

      const result = buildRatingDistribution(distribution)
      const percentageSum = Object.values(result.distribution).reduce(
        (acc, curr) => acc + curr,
        0
      )

      expect.assertions(2)

      expect(percentageSum).toBe(100)
      expect(result).toStrictEqual({
        ratingValue: 3.43,
        reviewCount: 14,
        distribution: {
          1: 0,
          2: 29,
          3: 0,
          4: 35,
          5: 36,
        },
      })
    })

    it('should increase the most frequent rating with the higher index when the sum of percentages is lower than 100% and there are more than 1 rating with the highest frequency', () => {
      const distribution: ApiClientProductRating = {
        average: 3.32,
        totalCount: 19,
        starsOne: 0,
        starsTwo: 4,
        starsThree: 5,
        starsFour: 5,
        starsFive: 5,
      }

      const result = buildRatingDistribution(distribution)
      const percentageSum = Object.values(result.distribution).reduce(
        (acc, curr) => acc + curr,
        0
      )

      expect.assertions(2)

      expect(percentageSum).toBe(100)
      expect(result).toStrictEqual({
        ratingValue: 3.32,
        reviewCount: 19,
        distribution: {
          1: 0,
          2: 21,
          3: 26,
          4: 26,
          5: 27,
        },
      })
    })
  })
})
