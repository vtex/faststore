import { contentSource } from 'faststore-config'
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
