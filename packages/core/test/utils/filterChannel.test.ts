import { describe, expect, it } from 'vitest'

import { filterChannel } from 'src/utils/utilities'

describe('filterChannel', () => {
  it('strips session-only keys so they never reach queries or cache keys', () => {
    expect(
      JSON.parse(
        filterChannel(
          JSON.stringify({
            salesChannel: '4',
            regionId: 'r1',
            hasOnlyDefaultSalesChannel: false,
            salesChannelSource: 'orderForm',
          })
        )
      )
    ).toEqual({ salesChannel: '4', regionId: 'r1' })
  })

  it('returns an empty object for an empty channel', () => {
    expect(filterChannel('')).toBe('{}')
  })
})
