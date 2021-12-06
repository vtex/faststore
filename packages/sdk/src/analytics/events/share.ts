// This isn't an ecommerce exclusive event, but it makes sense to include it in stores

export interface ShareParams {
  method?: string
  content_type?: string
  item_id?: string
}

export interface ShareEvent {
  name: 'share'
  params: ShareParams
}
