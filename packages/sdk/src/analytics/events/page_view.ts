export interface PageViewParams {
  page_title?: string,
  location?: string,
  send_page_view?: string,
}

export interface PageViewEvent {
  name: 'page_view'
  params: PageViewParams
}
