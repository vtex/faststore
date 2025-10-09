import discoveryConfig from '../../../discovery.config'
import { ServerExecuteFunction } from '../../server'

import { FaststoreAPIHandler } from '@vtex/faststore-api'

export default FaststoreAPIHandler(discoveryConfig, ServerExecuteFunction)
