import { isExpired } from '../../src/utils/getCookie'

describe('getCookie utils', () => {
  describe('isExpired', () => {
    const nowSec = 1_800_000_000

    beforeEach(() => {
      jest.useFakeTimers()
      jest.setSystemTime(new Date(nowSec * 1000))
    })

    afterEach(() => {
      jest.useRealTimers()
    })

    it('returns false when exp is in the future', () => {
      expect(isExpired(nowSec + 1)).toBe(false)
    })

    it('returns false when exp equals now', () => {
      expect(isExpired(nowSec)).toBe(false)
    })

    it('returns true when exp is strictly before now', () => {
      expect(isExpired(nowSec - 1)).toBe(true)
    })
  })
})
