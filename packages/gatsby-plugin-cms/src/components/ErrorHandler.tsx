import React, { FC, useEffect } from 'react'

interface Props {
  error: any
}

const ErrorHandler: FC<Props> = ({ error }) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      Something bad happened. Please take a look at the console for more
      detailed info
    </div>
  )
}

export default ErrorHandler
