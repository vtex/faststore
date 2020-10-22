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

interface Props extends ComponentProps {
  as: FC<ComponentProps>
  props: Partial<ComponentProps>
  propsPlaceholder: Partial<ComponentProps>
}

const ProgressiveLoader: FC<Props> = ({
  as: Component,
  props,
  propsPlaceholder,
  ...rest
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
      <Component {...currentProps} {...rest} />
      {currentProps.key !== props.key && (
        <div style={{ display: 'none' }}>
          <Component
            {...props}
            {...rest}
            ref={ref}
            onLoad={() => setCurrentProps(props)}
          />
        </div>
      )}
    </>
  )
}

export default ProgressiveLoader
