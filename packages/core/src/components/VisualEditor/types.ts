export interface VisualEditorMessage {
  type:
    | 'READY'
    | 'COMPONENT_SELECT'
    | 'COMPONENT_ADD'
    | 'COMPONENT_UPDATE'
    | 'COMPONENT_DELETE'
  payload: {
    requestId?: string
    componentId?: string
    componentType?: string
    componentKey?: string
    path?: string
    data?: any
  }
  timestamp: number
  sessionId: string
}

export interface VisualEditorResponse {
  type:
    | 'INITIAL_DATA'
    | 'COMPONENT_DATA'
    | 'SAVE_SUCCESS'
    | 'REFRESH_PREVIEW'
    | 'ERROR'
  payload: any
  requestId?: string
}

export interface ComponentData {
  componentKey: string
  sectionName: string
  element: HTMLElement
  data: any
}
