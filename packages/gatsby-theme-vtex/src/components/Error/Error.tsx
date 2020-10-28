import React, { FC } from 'react'

type Props = {
  error: any
}

const Error: FC<Props> = ({ error }) => {
  return (
    <div>
      Something went wrong. <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  )
}

export default Error
