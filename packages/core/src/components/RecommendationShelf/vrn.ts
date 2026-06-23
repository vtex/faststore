/* eslint-disable padding-line-between-statements */

import type { RecommendationType } from './RecommendationShelf.types'

type RecommendationVrnType =
  | 'rec-cross-v2'
  | 'rec-similar-v2'
  | 'rec-persona-v2'
  | 'rec-last-v2'
  | 'rec-top-items-v2'
  | 'rec-search-v2'
  | 'rec-next-v2'
  | 'rec-visual-v2'

const vrnPattern =
  /^vrn:recommendations:[^:]+:(rec-cross-v2|rec-similar-v2|rec-persona-v2|rec-last-v2|rec-top-items-v2|rec-search-v2|rec-next-v2|rec-visual-v2):[^:]+$/

export function isValidVrn(campaignVrn: string): boolean {
  return vrnPattern.test(campaignVrn)
}

function parseCampaignVrn(campaignVrn: string) {
  const [_, __, accountName, campaignType, campaignId] = campaignVrn.split(':')

  return {
    accountName,
    campaignId,
    campaignVrnType: campaignType as RecommendationVrnType,
  }
}

// Cross-Sell:  rec-cross-v2
// Similar Items:  rec-similar-v2
// Personalized:  rec-persona-v2
// Last Seen:  rec-last-v2
// Top Sellers:  rec-top-items-v2
// Next Interactions:  rec-next-v2
// Visual Similarity:  rec-visual-v2
// Search-Based:  rec-search-v2
export function getTypeFromVrn(campaignVrn: string): RecommendationType {
  const { campaignVrnType } = parseCampaignVrn(campaignVrn)

  switch (campaignVrnType) {
    case 'rec-cross-v2':
      return 'CROSS_SELL'

    case 'rec-similar-v2':
      return 'SIMILAR_ITEMS'

    case 'rec-persona-v2':
      return 'PERSONALIZED'

    case 'rec-last-v2':
      return 'LAST_SEEN'

    case 'rec-top-items-v2':
      return 'TOP_ITEMS'

    case 'rec-search-v2':
      return 'SEARCH_BASED'

    case 'rec-next-v2':
      return 'NEXT_INTERACTION'

    case 'rec-visual-v2':
      return 'VISUAL_SIMILARITY'

    default:
      throw new Error(`Unknown campaign type: ${campaignVrnType}`)
  }
}
