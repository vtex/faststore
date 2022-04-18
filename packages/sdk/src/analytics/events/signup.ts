// This isn't an ecommerce exclusive event, but it makes sense to include it in stores

import type { LocatorParam } from './common'

export interface SignupParams {
  method?: string
}

export interface SignupEvent {
  name: 'signup'
  params: SignupParams & LocatorParam
}
