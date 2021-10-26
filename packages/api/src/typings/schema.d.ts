declare module '*.graphql' {
  import type { ASTNode } from 'graphql'

  const schema: ASTNode

  export default schema
}
