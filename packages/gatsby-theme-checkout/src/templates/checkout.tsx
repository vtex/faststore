import React from 'react'
import type { FC } from 'react'
import type { PageProps } from 'gatsby'

import '../styles/checkout6-custom.css'
import '../scripts/checkout6-custom'

interface PageContext {
  body: string
  head: string
}

const Page: FC<PageProps<unknown, PageContext>> = ({
  pageContext: { body, head },
}) => {
  // eslint-disable-next-line no-console
  console.log({ body, head })

  return <div>Hello World</div>
}

export default Page
