import { contentSource } from '../../../discovery.config'
import { ContentSourceType } from './types'

export function isContentPlatformSource(): boolean {
  return (
    contentSource.type.toLocaleLowerCase() === ContentSourceType.ContentPlatform
  )
}
