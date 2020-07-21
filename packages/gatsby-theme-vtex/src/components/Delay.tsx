import React, { FC, useEffect, useState } from 'react'

const Delay: FC = ({ children }) => {
  const [shouldRender, render] = useState(false)

  useEffect(() => {
    // render(true)
  }, [])

  if (!shouldRender || !children) {
    return null
  }

  return <>{children}</>
}

export default Delay
