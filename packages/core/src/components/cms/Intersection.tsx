import type {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from 'react'
import { useEffect, useRef, useState } from 'react'

type IntersectionProps = {
  name?: string
} & IntersectionObserverInit &
  DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>

function Intersection({
  name = '',
  children,
  root = null,
  rootMargin,
  threshold = 0,
}: PropsWithChildren<IntersectionProps>) {
  const [isShow, setShow] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setShow(true)
          if (ref.current) {
            obs.unobserve(ref.current)
          }
        } else {
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
          data-section-name={name}
          ref={ref}
          // height value like 500 is required to make sections out of the viewport to be rendered on demand
          style={{
            // border: isShow ? '2px solid red' : '2px solid blue', // debug
            height: 850,
            width: '100%',
          }}
        ></div>
      )}

      {isShow && children}
    </>
  )
}

export default Intersection
