import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { FocusableElement } from 'tabbable'
import { tabbable } from 'tabbable'

interface TrapFocusParams {
  trapFocusRef: RefObject<HTMLElement>
}

/*
 * Element that will maintain the focus inside trapFocusRef, focus the first element,
 * and focus back on the element that was in focus when useTrapFocus was triggered.
 *
 * Inspired by Reakit useTrapFocus https://github.com/reakit/reakit/blob/a211d94da9f3b683182568a56479b91afb1b85ae/packages/reakit/src/Dialog/__utils/useFocusTrap.ts
 */
const useTrapFocus = ({ trapFocusRef }: TrapFocusParams) => {
  // #L31
  const tabbableNodesRef = useRef<FocusableElement[]>()

  const beforeElementRef = useRef<HTMLDivElement | null>(null)
  const afterElementRef = useRef<HTMLDivElement | null>(null)
  const nodeToRestoreRef = useRef<HTMLElement | null>(
    document.hasFocus() ? (document.activeElement as HTMLElement) : null
  )

  // Add before and after elements, and set refs.
  useEffect(() => {
    if (!trapFocusRef.current) {
      return
    }

    if (!beforeElementRef.current) {
      const beforeElement = document.createElement('div')

      beforeElement.tabIndex = 0
      beforeElement.setAttribute('aria-hidden', 'true')
      beforeElement.setAttribute('data-testid', 'beforeElement')
      beforeElementRef.current = beforeElement
    }

    if (!afterElementRef.current) {
      afterElementRef.current = beforeElementRef.current.cloneNode() as HTMLDivElement
      afterElementRef.current.setAttribute('data-testid', 'afterElement')
    }

    trapFocusRef.current.insertAdjacentElement(
      'beforebegin',
      beforeElementRef.current
    )

    trapFocusRef.current.insertAdjacentElement(
      'afterend',
      afterElementRef.current
    )
  }, [beforeElementRef, afterElementRef, trapFocusRef])

  // Focus back on the element that was focused when useTrapFocus is triggered.
  useEffect(() => {
    const nodeToRestore = nodeToRestoreRef.current

    return () => {
      nodeToRestore?.focus()
    }
  }, [nodeToRestoreRef])

  // Set focus on first tababble element
  useEffect(() => {
    if (!trapFocusRef.current) {
      return
    }

    if (!tabbableNodesRef.current) {
      tabbableNodesRef.current = tabbable(trapFocusRef.current)
    }

    const [firstTabbable] = tabbableNodesRef.current

    if (!firstTabbable) {
      trapFocusRef.current.focus()

      return
    }

    firstTabbable.focus()
  }, [trapFocusRef])

  // Handle loop focus. Set keydown and focusin event listeners
  useEffect(() => {
    if (
      !trapFocusRef.current ||
      !beforeElementRef.current ||
      !afterElementRef.current
    ) {
      return
    }

    const beforeElement = beforeElementRef.current
    const afterElement = afterElementRef.current
    const trapFocus = trapFocusRef.current

    const handleLoopFocus = (nativeEvent: FocusEvent) => {
      if (!document.hasFocus()) {
        return
      }

      tabbableNodesRef.current = tabbable(trapFocusRef.current!)

      if (!tabbableNodesRef.current.length) {
        trapFocus.focus()
      }

      /*
       * Handle loop focus from beforeElementRef. This node can only be focused if the user press shift tab.
       * It will focus the last element of the trapFocusRef.
       */
      if (nativeEvent.target === beforeElement) {
        tabbableNodesRef.current[tabbableNodesRef.current.length - 1]?.focus()
      }

      /*
       * Handle loop focus from afterElementRef. This node can only be focused if the user press tab.
       * It will focus the first element of the trapFocusRef.
       */
      if (nativeEvent.target === afterElement) {
        tabbableNodesRef.current[0]?.focus()
      }
    }

    beforeElement?.addEventListener('focusin', handleLoopFocus)
    afterElement?.addEventListener('focusin', handleLoopFocus)

    return () => {
      beforeElement?.removeEventListener('focusin', handleLoopFocus)
      afterElement?.removeEventListener('focusin', handleLoopFocus)
    }
  }, [tabbableNodesRef, afterElementRef, beforeElementRef, trapFocusRef])
}

export default useTrapFocus
