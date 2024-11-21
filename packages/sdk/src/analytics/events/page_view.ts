export interface PageViewParams {
  page_title?: string,
  page_location?: string,
  send_page_view?: boolean,
  [key: string]: any
}

export interface PageViewEvent {
  name: 'page_view'
  params: PageViewParams
}
