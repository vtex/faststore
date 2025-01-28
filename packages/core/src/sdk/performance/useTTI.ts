import { useEffect, useState } from 'react'

const TTI_TIMEOUT = 5000 // 5 seconds without long tasks as a criterion for Time To Interactive - https://web.dev/articles/tti

/**
 * Polyfill for requestIdleCallback, which is not available for every browser
 * https://caniuse.com/requestidlecallback
 */
function ric(callback: () => void) {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(callback)
  } else {
    window.setTimeout(callback, 1)
  }
}

export default function useTTI() {
  const [isInteractive, setIsInteractive] = useState(false)

  useEffect(() => {
    if ('PerformanceObserver' in window) {
      let lastTaskEnd = 0

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          lastTaskEnd = entry.startTime + entry.duration
        }
      })

      observer.observe({ type: 'longtask', buffered: true })

      // Monitoring when TTI might have been reached
      const checkTTI = () => {
        const now = performance.now()
        if (now - lastTaskEnd >= TTI_TIMEOUT) {
          observer.disconnect()
          setIsInteractive(true) // Sets the state to true when TTI is estimated
        } else {
          ric(checkTTI) // Keeps checking while the browser is idle
        }
      }

      ric(checkTTI)
    }
  }, [])

  return { isInteractive }
}
