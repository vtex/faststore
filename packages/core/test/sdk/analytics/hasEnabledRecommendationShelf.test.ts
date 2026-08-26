import { describe, expect, it } from 'vitest'

import { hasEnabledRecommendationShelf } from 'src/sdk/analytics/utils/hasEnabledRecommendationShelf'

describe('hasEnabledRecommendationShelf', () => {
  it('returns false for empty or unrelated page props', () => {
    expect(hasEnabledRecommendationShelf(undefined)).toBe(false)
    expect(hasEnabledRecommendationShelf({})).toBe(false)
    expect(
      hasEnabledRecommendationShelf({
        sections: [{ name: 'ProductShelf', data: {} }],
      })
    ).toBe(false)
  })

  it('returns true when a RecommendationShelf has a campaign VRN', () => {
    expect(
      hasEnabledRecommendationShelf({
        sections: [
          {
            name: 'RecommendationShelf',
            data: { campaignVrn: 'vrn:x' },
          },
        ],
      })
    ).toBe(true)
  })

  it('returns true when a page section enables recommendations', () => {
    expect(
      hasEnabledRecommendationShelf({
        sections: [
          {
            name: 'RecommendationShelf',
            data: { enableRecommendations: true, campaignVrn: 'vrn:x' },
          },
        ],
      })
    ).toBe(true)
  })

  it('returns true when a global section enables recommendations', () => {
    expect(
      hasEnabledRecommendationShelf({
        globalSections: {
          sections: [
            {
              $componentKey: 'RecommendationShelf',
              data: { enableRecommendations: true },
            },
          ],
        },
      })
    ).toBe(true)
  })

  it('returns true when page.sections enables recommendations', () => {
    expect(
      hasEnabledRecommendationShelf({
        page: {
          sections: [
            {
              name: 'RecommendationShelf',
              data: { enableRecommendations: true },
            },
          ],
        },
      })
    ).toBe(true)
  })

  it('returns false when the shelf is present but enableRecommendations is false', () => {
    expect(
      hasEnabledRecommendationShelf({
        sections: [
          {
            name: 'RecommendationShelf',
            data: { enableRecommendations: false },
          },
        ],
      })
    ).toBe(false)
  })

  it('returns true when at least one of multiple shelves enables recommendations', () => {
    expect(
      hasEnabledRecommendationShelf({
        sections: [
          {
            name: 'RecommendationShelf',
            data: { enableRecommendations: false },
          },
          {
            name: 'RecommendationShelf',
            data: { enableRecommendations: true },
          },
        ],
      })
    ).toBe(true)
  })

  it('returns false when the cart sidebar has a campaign VRN but the shelf is hidden', () => {
    expect(
      hasEnabledRecommendationShelf({
        globalSections: {
          sections: [
            {
              name: 'CartSidebar',
              data: {
                title: 'Your cart',
                recommendations: { campaignVrn: 'vrn:x' },
              },
            },
          ],
        },
      })
    ).toBe(false)
  })

  it('returns true when the cart sidebar displays its mini cart shelf', () => {
    expect(
      hasEnabledRecommendationShelf({
        globalSections: {
          sections: [
            {
              name: 'CartSidebar',
              data: {
                title: 'Your cart',
                recommendations: {
                  shouldDisplayRecommendationShelf: true,
                  campaignVrn: 'vrn:x',
                },
              },
            },
          ],
        },
      })
    ).toBe(true)
  })

  it('returns true when the cart sidebar is identified by $componentKey', () => {
    expect(
      hasEnabledRecommendationShelf({
        globalSections: {
          sections: [
            {
              $componentKey: 'CartSidebar',
              data: {
                recommendations: { shouldDisplayRecommendationShelf: true },
              },
            },
          ],
        },
      })
    ).toBe(true)
  })

  it('returns false when the cart sidebar has no recommendations configured', () => {
    expect(
      hasEnabledRecommendationShelf({
        globalSections: {
          sections: [{ name: 'CartSidebar', data: { title: 'Your cart' } }],
        },
      })
    ).toBe(false)
  })

  it('returns false when the cart sidebar shelf is configured but disabled', () => {
    expect(
      hasEnabledRecommendationShelf({
        globalSections: {
          sections: [
            {
              name: 'CartSidebar',
              data: {
                recommendations: {
                  shouldDisplayRecommendationShelf: false,
                  campaignVrn: 'vrn:x',
                },
              },
            },
          ],
        },
      })
    ).toBe(false)
  })

  it('does not opt in from a non-cart section carrying a recommendations object', () => {
    expect(
      hasEnabledRecommendationShelf({
        sections: [
          {
            name: 'ProductShelf',
            data: {
              recommendations: { shouldDisplayRecommendationShelf: true },
            },
          },
        ],
      })
    ).toBe(false)
  })
})
