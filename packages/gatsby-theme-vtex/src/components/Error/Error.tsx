import React, { FC } from 'react'

import Layout from '../Layout'

type Props = {
  error: any
}

const Error: FC<Props> = ({ error }) => (
  <Layout>
    <div>
      Something went wrong. <pre>{JSON.stringify(error, null, 2)}</pre>
    </div>
  </Layout>
)

export default Error
