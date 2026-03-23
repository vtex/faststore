import type { RefObject } from 'react'
import { useEffect } from 'react'

const WEBCHAT_SCRIPT_URL = 'https://cdn.cloud.weni.ai/agentic-cx.js'

/**
 * Injects the webchat script when the hook runs, unless third-party scripts are disabled.
 * @param containerRef - Optional ref to an HTMLElement. When provided, the script is appended inside this container (e.g. inside the Webchat section). Otherwise the script is appended to document.head.
 * Must be used in a component rendered in the body (not inside Next.js Head) so that useEffect runs on the client.
 */
export function useWebchatScript(
  containerRef?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (process.env.DISABLE_3P_SCRIPTS) return

    const script = document.createElement('script')
    script.src = WEBCHAT_SCRIPT_URL
    const container = containerRef?.current
    if (container) {
      container.appendChild(script)
    } else {
      document.head.appendChild(script)
    }

    return () => {
      script.remove()
    }
  }, [containerRef])
}
