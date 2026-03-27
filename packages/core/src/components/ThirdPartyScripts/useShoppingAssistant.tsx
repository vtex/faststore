import type { RefObject } from 'react'
import { useEffect } from 'react'

const SHOPPING_ASSISTANT_SCRIPT_URL = 'https://cdn.cloud.weni.ai/agentic-cx.js'

/**
 * Injects the Shopping Assistant script when the hook runs, unless third-party scripts are disabled.
 * @param containerRef - Optional ref to an HTMLElement. When provided, the script is appended inside this container (e.g. inside the ShoppingAssistant section). Otherwise the script is appended to document.head.
 * Must be used in a component rendered in the body (not inside Next.js Head) so that useEffect runs on the client.
 */
export function useShoppingAssistant(
  containerRef?: RefObject<HTMLElement | null>
): void {
  useEffect(() => {
    if (process.env.DISABLE_3P_SCRIPTS) return

    const script = document.createElement('script')
    script.src = SHOPPING_ASSISTANT_SCRIPT_URL
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
