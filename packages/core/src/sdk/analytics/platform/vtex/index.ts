import type { AnalyticsEvent } from '@faststore/sdk'

import handleSearchEvent from './search'
import handleRCEvent from './rc'

export default function sendEvent(event: AnalyticsEvent) {
  // VTEX RC
  handleRCEvent(event)

  // VTEX Intelligent Search
  handleSearchEvent(event)
}
