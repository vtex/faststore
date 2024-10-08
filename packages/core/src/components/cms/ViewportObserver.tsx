import type {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'
import { useEffect, useRef, useState } from 'react'

const viewportSize = 825 // mobile height to prevent sections that are outside the viewport from being rendered initially. We are using Moto G Power devices as a reference.

type ViewportObserverProps = {
  name?: string
} & IntersectionObserverInit &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

function ViewportObserver({
  name = '',
  threshold = 0,
  root = null,
  rootMargin,
  children,
}: PropsWithChildren<ViewportObserverProps>) {
  const [isShow, setShow] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setShow(true)
          console.log('IN')
          if (ref.current) {
            obs.unobserve(ref.current)
          }
        } else {
          console.log('OUT')
          setShow(false)
        }
      },
      { root, rootMargin, threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [root, rootMargin, threshold])

  return (
    <>
      {!isShow && (
        <div
          data-store-section-name={name}
          ref={ref}
          style={{
            border: isShow ? '5px solid red' : '5px solid blue', // debug
            backgroundColor: isShow ? 'gray' : 'pink', // debug
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
