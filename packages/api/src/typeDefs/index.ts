import { print } from 'graphql'
import path from 'path'

import { loadFilesSync } from '@graphql-tools/load-files'

export const typeDefs = loadFilesSync(path.join(process.cwd()), { extensions: ['.graphql'] })
  .map(print)
  .join('\n')
