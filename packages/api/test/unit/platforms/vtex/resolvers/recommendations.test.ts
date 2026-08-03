import { describe, expect, it, vi } from 'vitest'

import { BadRequestError } from '../../../../../src/platforms/errors'

vi.mock('../../../../../src/platforms/vtex/utils/sku', () => ({
  pickBestSku: vi.fn((items: unknown[]) => items?.[0] ?? null),
}))

vi.mock('../../../../../src/platforms/vtex/utils/enhanceSku', () => ({
  enhanceSku: vi.fn((sku: unknown, product: unknown) => ({ sku, product })),
}))

import { recommendations } from '../../../../../src/platforms/vtex/resolvers/recommendations'

const VALID_VRN = 'vrn:recommendations:acc:rec-top-items-v2:campaign-1'

const makeContext = (recResult: unknown = {}) => {
  const recommendationsFn = vi.fn().mockResolvedValue(recResult)

  return {
    ctx: {
      clients: {
        commerce: {
          recommendation: {
            recommendations: recommendationsFn,
          },
        },
      },
      storage: {
        channel: { salesChannel: '1' },
        locale: 'en-US',
      },
    } as any,
    recommendationsFn,
  }
}

describe('recommendations resolver', () => {
  it('throws BadRequestError when campaignVrn is missing', async () => {
    const { ctx } = makeContext()

    await expect(
      recommendations(null, { campaignVrn: '' } as any, ctx)
    ).rejects.toThrow(BadRequestError)
  })

  it('throws BadRequestError when campaignVrn is malformed', async () => {
    const { ctx } = makeContext()

    await expect(
      recommendations(null, { campaignVrn: 'not-a-vrn' } as any, ctx)
    ).rejects.toThrow(BadRequestError)
  })

  it('throws BadRequestError when userId is present but blank', async () => {
    const { ctx } = makeContext()

    await expect(
      recommendations(
        null,
        { campaignVrn: VALID_VRN, userId: '   ' } as any,
        ctx
      )
    ).rejects.toThrow(BadRequestError)
  })

  it('throws BadRequestError when products contains an empty string', async () => {
    const { ctx } = makeContext()

    await expect(
      recommendations(
        null,
        { campaignVrn: VALID_VRN, products: ['ok', '  '] } as any,
        ctx
      )
    ).rejects.toThrow(BadRequestError)
  })

  it('forwards normalized args and maps the BFF response', async () => {
    const recResult = {
      products: [{ items: [{ id: 'sku-1' }] }],
      correlationId: 'corr-1',
      campaign: { id: 'camp-1', title: 'Top items', type: 'TOP_ITEMS' },
    }
    const { ctx, recommendationsFn } = makeContext(recResult)

    const result = await recommendations(
      null,
      {
        campaignVrn: ` ${VALID_VRN} `,
        userId: ' user-1 ',
        products: ['pg-1'],
      } as any,
      ctx
    )

    expect(recommendationsFn).toHaveBeenCalledWith({
      campaignVrn: VALID_VRN,
      userId: 'user-1',
      products: ['pg-1'],
      salesChannel: '1',
      locale: 'en-US',
    })
    expect(result.correlationId).toBe('corr-1')
    expect(result.campaign).toEqual(recResult.campaign)
    expect(result.products).toHaveLength(1)
  })

  it('defaults products to an empty array and drops items without a sku', async () => {
    const recResult = {
      products: [{ items: [] }],
      correlationId: 'corr-2',
      campaign: { id: 'camp-2', type: 'PERSONALIZED' },
    }
    const { ctx, recommendationsFn } = makeContext(recResult)

    const result = await recommendations(
      null,
      { campaignVrn: VALID_VRN } as any,
      ctx
    )

    expect(recommendationsFn).toHaveBeenCalledWith(
      expect.objectContaining({ products: [], userId: undefined })
    )
    expect(result.products).toHaveLength(0)
  })
})
