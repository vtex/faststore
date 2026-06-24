import type { RecommendationType } from './RecommendationShelf.types'

// Single source of truth for the campaign taxonomy: maps each Intelligent Search
// campaign VRN type to its `RecommendationType`. The supported VRN types, the
// validation regex and the VRN-to-type resolution are all derived from this map
// so the list of campaign types lives in exactly one place.
//
// Reference:
//   Cross-Sell          rec-cross-v2
//   Similar Items       rec-similar-v2
//   Personalized        rec-persona-v2
//   Last Seen           rec-last-v2
//   Top Sellers         rec-top-items-v2
//   Search-Based        rec-search-v2
//   Next Interactions   rec-next-v2
//   Visual Similarity   rec-visual-v2
const VRN_TYPE_TO_RECOMMENDATION = {
  'rec-cross-v2': 'CROSS_SELL',
  'rec-similar-v2': 'SIMILAR_ITEMS',
  'rec-persona-v2': 'PERSONALIZED',
  'rec-last-v2': 'LAST_SEEN',
  'rec-top-items-v2': 'TOP_ITEMS',
  'rec-search-v2': 'SEARCH_BASED',
  'rec-next-v2': 'NEXT_INTERACTION',
  'rec-visual-v2': 'VISUAL_SIMILARITY',
} as const satisfies Record<string, RecommendationType>

type RecommendationVrnType = keyof typeof VRN_TYPE_TO_RECOMMENDATION

const vrnPattern = new RegExp(
  `^vrn:recommendations:[^:]+:(${Object.keys(VRN_TYPE_TO_RECOMMENDATION).join(
    '|'
  )}):[^:]+$`
)

export function isValidVrn(campaignVrn: string): boolean {
  return vrnPattern.test(campaignVrn)
}

function parseCampaignVrn(campaignVrn: string) {
  const [, , accountName, campaignType, campaignId] = campaignVrn.split(':')

  return { accountName, campaignType, campaignId }
}

// Resolves a campaign VRN into its `RecommendationType`. Returns `null` for
// malformed or unknown VRNs so callers can degrade gracefully instead of
// throwing during render.
export function getTypeFromVrn(campaignVrn: string): RecommendationType | null {
  const { campaignType } = parseCampaignVrn(campaignVrn)

  return (
    VRN_TYPE_TO_RECOMMENDATION[campaignType as RecommendationVrnType] ?? null
  )
}
