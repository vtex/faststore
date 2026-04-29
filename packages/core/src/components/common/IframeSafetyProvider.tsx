import { useEffect } from 'react'
import { setupCrossOriginListener, isInIframe } from '../../utils/iframe-safety'

/**
 * Provider component that sets up iframe safety measures
 * Should be added to the app root
 */
export function IframeSafetyProvider({
  children,
}: { children: React.ReactNode }) {
  useEffect(() => {
    // Only setup if we're in an iframe
    if (isInIframe()) {
      setupCrossOriginListener()

      // Add class to body for CSS adjustments if needed
      document.body.classList.add('in-iframe')

      // Log for debugging
      console.info(
        'FastStore: Running in iframe mode with safety measures enabled'
      )
    }

    return () => {
      document.body.classList.remove('in-iframe')
    }
  }, [])

  return <>{children}</>
}
