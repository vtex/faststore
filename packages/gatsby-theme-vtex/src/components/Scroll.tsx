import React, { FC, useEffect } from 'react'

const Scroll: FC = ({ children }) => {
  const { pathname } = window.location

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return <>{children}</>
}

export default Scroll
