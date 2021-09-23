import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'
import type { FocusableElement } from 'tabbable'
import { tabbable } from 'tabbable'

interface TrapFocusParams {
  sentinelStartRef: RefObject<HTMLElement>
  trapFocusRef: RefObject<HTMLElement>
  sentinelEndRef: RefObject<HTMLElement>
}

/**
 * Element that will maintain the focus inside trapFocusRef, focus the first element,
 * and focus back on the element that was in focus when useTrapFocus was triggered.
 *
 * Inspired by Material UI TrapFocus https://github.com/mui-org/material-ui/blob/master/packages/mui-core/src/Unstable_TrapFocus/Unstable_TrapFocus.js
 */
const useTrapFocus = ({
  trapFocusRef,
  sentinelStartRef,
  sentinelEndRef,
}: TrapFocusParams) => {
  const tabbableNodesRef = useRef<FocusableElement[]>()
  const lastKeyDownRef = useRef<KeyboardEvent>()

  const nodeToRestoreRef = useRef<HTMLElement | null>(
    document.hasFocus() ? (document.activeElement as HTMLElement) : null
  )

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
    const handleLoopFocus = (nativeEvent: FocusEvent) => {
      if (
        lastKeyDownRef.current?.key !== 'Tab' ||
        !trapFocusRef.current ||
        !document.hasFocus()
      ) {
        return
      }

      if (trapFocusRef.current.contains(nativeEvent.target as Node)) {
        return
      }

      tabbableNodesRef.current = tabbable(trapFocusRef.current)

      /*
       * Handle loop focus from sentinelStartRef. This node can only be focused if the user press shift tab.
       * It will focus the last element of the trapFocusRef.
       */
      if (
        nativeEvent.target === sentinelStartRef.current &&
        lastKeyDownRef.current.shiftKey
      ) {
        tabbableNodesRef.current[tabbableNodesRef.current.length - 1]?.focus()
      }

      /*
       * Handle loop focus from sentinelEndRef. This node can only be focused if the user press tab.
       * It will focus the first element of the trapFocusRef.
       */
      if (nativeEvent.target === sentinelEndRef.current) {
        tabbableNodesRef.current[0]?.focus()
      }
    }

    const handleKeyDown = (nativeEvent: KeyboardEvent) => {
      lastKeyDownRef.current = nativeEvent
    }

    document.addEventListener('focusin', handleLoopFocus)
    document.addEventListener('keydown', handleKeyDown, true)

    return () => {
      document.removeEventListener('focusin', handleLoopFocus)
      document.removeEventListener('keydown', handleKeyDown, true)
    }
  }, [tabbableNodesRef, sentinelEndRef, sentinelStartRef, trapFocusRef])
}

export default useTrapFocus
