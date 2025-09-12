import type { VisualEditorMessage, VisualEditorResponse } from './types'

export class PostMessageClient {
  private readonly targetOrigin: string
  private readonly sessionId: string
  private readonly messageHandlers: Map<
    string,
    (message: VisualEditorResponse) => void
  > = new Map()

  constructor(
    private readonly options: {
      targetOrigin: string
      onMessage?: (message: VisualEditorResponse) => void
    }
  ) {
    this.targetOrigin = options.targetOrigin
    this.sessionId = Math.random().toString(36).substring(7)

    this.init()
  }

  private init() {
    window.addEventListener('message', this.handleMessage)

    // Send ready message to parent
    this.send({
      type: 'READY',
      payload: {},
      timestamp: Date.now(),
      sessionId: this.sessionId,
    })
  }

  private readonly handleMessage = (event: MessageEvent) => {
    // Validate origin
    if (event.origin !== this.targetOrigin) {
      return
    }

    const message = event.data as VisualEditorResponse

    if (this.options.onMessage) {
      this.options.onMessage(message)
    }

    // Handle specific message handlers
    if (message.requestId && this.messageHandlers.has(message.requestId)) {
      const handler = this.messageHandlers.get(message.requestId)!
      handler(message)
      this.messageHandlers.delete(message.requestId)
    }
  }

  public send(message: VisualEditorMessage) {
    if (window.parent !== window) {
      window.parent.postMessage(message, this.targetOrigin)
    }
  }

  public sendWithResponse(
    message: VisualEditorMessage,
    timeout = 5000
  ): Promise<VisualEditorResponse> {
    return new Promise((resolve, reject) => {
      const requestId = Math.random().toString(36).substring(7)

      // Set up the response handler
      this.messageHandlers.set(requestId, resolve)

      // Set up timeout
      setTimeout(() => {
        if (this.messageHandlers.has(requestId)) {
          this.messageHandlers.delete(requestId)
          reject(new Error('[CMS VE] Message timeout'))
        }
      }, timeout)

      this.send({
        ...message,
        payload: {
          ...message.payload,
          requestId,
        },
      })
    })
  }

  public destroy() {
    window.removeEventListener('message', this.handleMessage)
    this.messageHandlers.clear()
  }
}
