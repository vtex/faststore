import { afterEach, describe, expect, it, vi } from 'vitest'

vi.mock('@faststore/core/api', () => ({ gql: () => ({ __meta__: {} }) }))

const useQueryMock = vi.hoisted(() => vi.fn())
vi.mock('src/sdk/graphql/useQuery', () => ({
  useQuery: useQueryMock,
}))

import { useRecommendations } from 'src/components/sections/RecommendationShelf/useRecommendations'

afterEach(() => {
  vi.clearAllMocks()
})

describe('useRecommendations', () => {
  it('does not run the query when args are null', () => {
    useQueryMock.mockReturnValue({
      data: undefined,
      error: null,
      isLoading: false,
    })

    const { data } = useRecommendations(null)

    expect(data).toBeUndefined()
    const options = useQueryMock.mock.calls[0][2]
    expect(options.doNotRun).toBe(true)
  })

  it('unwraps the recommendations payload when args are provided', () => {
    const recommendations = {
      products: [{ productId: 'p-1' }],
      correlationId: 'c-1',
      campaign: { id: 'camp-1', title: 'Top', type: 'TOP_ITEMS' },
    }

    useQueryMock.mockReturnValue({
      data: { recommendations },
      error: null,
      isLoading: false,
    })

    const args = { userId: 'u-1', campaignVrn: 'vrn:x', products: [] }
    const { data, isLoading, error } = useRecommendations(args)

    expect(data).toEqual(recommendations)
    expect(isLoading).toBe(false)
    expect(error).toBeNull()
    expect(useQueryMock.mock.calls[0][2].doNotRun).toBe(false)
  })
})
