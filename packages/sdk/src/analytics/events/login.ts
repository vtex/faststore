// This isn't an ecommerce exclusive event, but it makes sense to include it in stores

export interface LoginData {
  method?: string
}

export interface LoginEvent {
  type: 'login'
  data: LoginData
}
