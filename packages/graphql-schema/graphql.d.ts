// declare module '*.graphql' {
//   import { DocumentNode } from 'graphql'
//   const c: DocumentNode;
//   export default c;
// }
declare module '*.graphql' {
  // import { DocumentNode } from 'graphql'
  const c: string
  export default c
}
