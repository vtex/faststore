import React, {
  ReactEventHandler,
  FC,
  Ref,
  useEffect,
  useRef,
  useState,
} from 'react'

interface ComponentProps {
  key?: string | number | null
  ref?: Ref<HTMLImageElement>
  onLoad?: ReactEventHandler<any>
  variant?: string
}

interface Props {
  as: FC<ComponentProps>
  props: ComponentProps
  propsPlaceholder: ComponentProps
}

const ProgressiveLoader: FC<Props> = ({
  as: Component,
  props,
  propsPlaceholder,
}) => {
  const [currentProps, setCurrentProps] = useState(propsPlaceholder)
  const ref = useRef<HTMLImageElement>(null)
  const complete = ref.current?.complete

  // // Resets component state when propsPlaceholder changes
  useEffect(() => {
    if (
      currentProps.key !== propsPlaceholder.key &&
      currentProps.key !== props.key
    ) {
      setCurrentProps(propsPlaceholder)
    }
  }, [currentProps.key, props.key, propsPlaceholder])

  // // when image is already loaded, fire the loaded event
  useEffect(() => {
    if (ref.current?.complete) {
      setCurrentProps(props)
    }
  }, [complete, props])

  return (
    <>
      <Component {...currentProps} />
      {currentProps.key !== props.key && (
        <div style={{ display: 'none' }}>
          <Component
            {...props}
            ref={ref}
            onLoad={() => setCurrentProps(props)}
          />
        </div>
      )}
    </>
  )
}

export default ProgressiveLoader
