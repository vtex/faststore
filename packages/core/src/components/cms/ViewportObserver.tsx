import type {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

const viewportSize = 825 // mobile height to prevent sections that are outside the viewport from being rendered initially. We are using Moto G Power devices as a reference.

type ViewportObserverProps = {
  /**
   * Identify the store section
   */
  name?: string
  /**
   * Just for debugging/testing purposes to better see the section in the viewport
   */
  debug?: boolean
} & IntersectionObserverInit &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

function ViewportObserver({
  name = '',
  threshold = 0,
  root = null,
  rootMargin,
  children,
  debug = false,
}: PropsWithChildren<ViewportObserverProps>) {
  const [isShow, setShow] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  const observerCallback = useCallback(
    ([entry]: IntersectionObserverEntry[], obs: IntersectionObserver) => {
      if (entry.isIntersecting) {
        if (debug) console.log('IN')
        setShow(true)
        if (ref.current) {
          obs.unobserve(ref.current)
        }
      } else {
        setShow(false)
        if (debug) console.log('OUT')
      }
    },
    []
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
      {!isShow && (
        <div
          data-store-section-name={name}
          ref={ref}
          style={{
            border: debug
              ? isShow
                ? '8px solid red'
                : '8px solid blue'
              : undefined,
            backgroundColor: debug ? (isShow ? 'gray' : 'pink') : undefined,
            height: viewportSize, // required to make sections out of the viewport to be rendered on demand
            width: '100%',
          }}
        ></div>
      )}

      {isShow && children}
    </>
  )
}

export default ViewportObserver
