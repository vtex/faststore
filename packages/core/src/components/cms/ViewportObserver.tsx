import type { PropsWithChildren } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

// Mobile height to prevent sections outside the viewport from being rendered initially.
// We are using the Moto G Power device measurement as a reference, as used by PageSpeed Insights.
const VIEWPORT_SIZE = 823

type ViewportObserverProps = {
  /**
   * Identify the store section
   */
  sectionName?: string
  /**
   * Debug/test purposes: enables visual debugging to identify the visibility of the section.
   */
  debug?: boolean
} & IntersectionObserverInit

function ViewportObserver({
  sectionName = '',
  threshold = 0,
  root = null,
  rootMargin,
  children,
  debug = false,
}: PropsWithChildren<ViewportObserverProps>) {
  const [isVisible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const observerCallback = useCallback(
    ([entry]: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      if (entry.isIntersecting) {
        if (debug) {
          console.log(`section '${sectionName}' VISIBLE`)
          document.body.style.border = '2px solid green'
        }
        setVisible(true)
        if (ref.current) {
          obs.unobserve(ref.current)
        }
      } else {
        setVisible(false)
        if (debug) {
          console.log(`section '${sectionName}' NOT VISIBLE`)
          document.body.style.border = '2px solid red'
          document.body.style.height = `${VIEWPORT_SIZE}px`
          document.body.style.boxSizing = 'border-box'
        }
      }
    },
    [debug, sectionName]
  )

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root,
      rootMargin,
      threshold,
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [observerCallback, root, rootMargin, threshold])

  return (
    <>
      {!isVisible && (
        <div
          data-store-section-name={sectionName}
          ref={ref}
          style={{
            border: debug ? '2px solid red' : undefined,
            backgroundColor: debug ? 'red' : undefined,
            height: VIEWPORT_SIZE, // required to make sections out of the viewport to be rendered on demand
            width: '100%',
          }}
        ></div>
      )}

      {isVisible && children}
    </>
  )
}

export default ViewportObserver
