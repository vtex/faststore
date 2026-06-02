import { contentSource } from '../../../discovery.config'
import { ContentSourceType, type PreviewData } from './types'

export function isContentPlatformSource(): boolean {
  return (
    contentSource.type.toLocaleLowerCase() === ContentSourceType.ContentPlatform
  )
}

export function isBranchPreview(
  previewData: PreviewData | null | undefined
): boolean {
  return (
    isContentPlatformSource() &&
    !!(previewData?.versionId || previewData?.releaseId)
  )
}

/**
 * Extracts the A/B test variant branch id from route params. An empty string
 * (e.g. `?__variant=` rewritten to an empty path segment) is treated as absent.
 */
export function getVariantBranchId(
  params: { branchId?: string } | null | undefined
): string | undefined {
  const branchId = params?.branchId
  return typeof branchId === 'string' && branchId.length > 0
    ? branchId
    : undefined
}
