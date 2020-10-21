import React, { FC, ReactEventHandler, useEffect, useState } from 'react'

interface ComponentProps {
  onLoad?: ReactEventHandler
}

type IncomingComponentProps = Omit<ComponentProps, 'style'>

interface Props {
  as: FC<ComponentProps>
  props: IncomingComponentProps
  propsPlaceholder: IncomingComponentProps
}

const hidden = { display: 'none' }
const initial = { display: 'initial' }

const ProgressiveLoader: FC<Props> = ({
  as: Component,
  props,
  propsPlaceholder,
}) => {
  const [currentProps, setCurrentProps] = useState(propsPlaceholder)
  const [displayPlaceholder, setDisplayPlaceholder] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loaded) {
      setDisplayPlaceholder(false)
    }
  }, [currentProps, loaded])

  useEffect(() => {
    setCurrentProps(propsPlaceholder)
  }, [propsPlaceholder])

  return (
    <>
      <div style={displayPlaceholder ? initial : hidden}>
        <Component {...propsPlaceholder} />
      </div>
      <div style={displayPlaceholder ? hidden : initial}>
        <Component
          {...props}
          onLoad={() => {
            setCurrentProps(props)
            setLoaded(true)
          }}
        />
      </div>
    </>
  )
}

export default ProgressiveLoader
