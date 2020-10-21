import React, { FC, ReactEventHandler, useEffect, useState } from 'react'

interface ComponentProps {
  key?: string | number | null
  onLoad?: ReactEventHandler
}

type IncomingComponentProps = Omit<ComponentProps, 'style'>

interface Props {
  as: FC<ComponentProps>
  props: IncomingComponentProps
  propsPlaceholder: IncomingComponentProps
}

const ProgressiveLoader: FC<Props> = ({
  as: Component,
  props,
  propsPlaceholder,
}) => {
  const [currentProps, setCurrentProps] = useState(propsPlaceholder)

  useEffect(() => {
    setCurrentProps(propsPlaceholder)
  }, [propsPlaceholder])

  return (
    <>
      <Component {...currentProps} />

      {props.key !== propsPlaceholder.key && (
        <div style={{ display: 'none' }}>
          <Component
            {...props}
            onLoad={() => {
              setCurrentProps(props)
            }}
          />
        </div>
      )}
    </>
  )
}

export default ProgressiveLoader
