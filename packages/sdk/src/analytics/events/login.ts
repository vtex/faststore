// This isn't an ecommerce exclusive event, but it makes sense to include it in stores

import type { LocatorParam } from './common'

export interface LoginParams {
  method?: string
}

export interface LoginEvent {
  name: 'login'
  params: LoginParams & LocatorParam
}
