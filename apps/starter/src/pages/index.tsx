export { getStaticProps } from '@vtex/faststore-core/pages/index'
import { GraphqlRequest } from '@vtex/faststore-core/fetch'
import { gql } from '@vtex/faststore-core/generated/gql'
import { default as IndexPage } from '@vtex/faststore-core/pages/index'
import type { ComponentProps } from 'react'
import { useEffect } from 'react'

const Operation = gql(`
  query Custom {
    MyCustomQuery
  }
`)

export default (props: ComponentProps<typeof IndexPage>) => {
  useEffect(() => {
    GraphqlRequest({ operation: Operation, variables: {} }).then((resp) => {
      console.log('My Custom query running', resp)
    })
  })

  return <IndexPage {...props} />
}
