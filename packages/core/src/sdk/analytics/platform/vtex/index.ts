import type { AnalyticsEvent } from '@faststore/sdk'

import handleRCEvent from './rc'
import handleSearchEvent from './search'

export default function sendEvent(event: AnalyticsEvent) {
  // VTEX RC
  handleRCEvent(event)

  // VTEX Intelligent Search
  handleSearchEvent(event)
}
