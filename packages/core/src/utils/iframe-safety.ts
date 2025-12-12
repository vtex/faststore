/**
 * Safe iframe communication utilities
 * Prevents SecurityError when running inside cross-origin iframes
 */

/**
 * Check if the current window is running inside an iframe
 */
export function isInIframe(): boolean {
  try {
    return window.self !== window.top
  } catch (e) {
    // If accessing window.top throws an error, we're in a cross-origin iframe
    return true
  }
}

/**
 * Check if we can safely access the parent window
 */
export function canAccessParent(): boolean {
  if (!isInIframe()) {
    return false
  }

  try {
    // Try to access a property of parent window
    // This will throw if cross-origin
    const test = window.parent.location.href
    return true
  } catch (e) {
    return false
  }
}

/**
 * Safe wrapper for dispatching events
 * Falls back to postMessage for cross-origin communication
 */
export function safeDispatchEvent(event: Event | CustomEvent): void {
  try {
    // First try direct dispatch
    window.dispatchEvent(event)
  } catch (error) {
    // If that fails and we're in an iframe, use postMessage
    if (isInIframe()) {
      const message = {
        type: 'faststore-event',
        eventType: event.type,
        detail: event instanceof CustomEvent ? event.detail : null,
      }

      // Send to parent if possible
      try {
        window.parent.postMessage(message, '*')
      } catch (e) {
        // Even postMessage might fail in some restricted environments
        console.warn('Unable to dispatch event in iframe context:', e)
      }
    }
  }
}

/**
 * Setup listener for cross-origin events
 */
export function setupCrossOriginListener(): void {
  if (typeof window === 'undefined') return

  window.addEventListener('message', (event) => {
    // Only process messages from trusted origins
    if (!isValidOrigin(event.origin)) {
      return
    }

    // Check if it's our custom event format
    if (event.data?.type === 'faststore-event') {
      const customEvent = new CustomEvent(event.data.eventType, {
        detail: event.data.detail,
      })

      // Dispatch locally
      window.dispatchEvent(customEvent)
    }
  })
}

/**
 * Validate if an origin is trusted
 */
function isValidOrigin(origin: string): boolean {
  const trustedOrigins = [
    'https://ai-agents-vtex.vercel.app',
    'https://sfj-vee1fae--storeframework.preview.vtex.app',
    // Add more trusted origins as needed
  ]

  // Check exact matches
  if (trustedOrigins.includes(origin)) {
    return true
  }

  // Check patterns
  const patterns = [
    /^https:\/\/.*\.myvtex\.com$/,
    /^https:\/\/.*\.preview\.vtex\.app$/,
    /^http:\/\/localhost:\d+$/,
  ]

  return patterns.some((pattern) => pattern.test(origin))
}
