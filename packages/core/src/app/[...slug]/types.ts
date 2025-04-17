import type {
  ServerCollectionPageQueryQuery,
  ServerManyProductsQueryQuery,
  ServerManyProductsQueryQueryVariables,
} from '@generated/graphql'
import type { GlobalSectionsData } from 'src/components/cms/GlobalSections'
import type { PageContentType } from 'src/server/cms'
import type { PLPContentType } from 'src/server/cms/plp'

interface BaseCatchProps {
  globalSections: GlobalSectionsData
}

export type CatchAllProps = BaseCatchProps &
  (
    | {
        type: 'plp'
        page: PLPContentType
        data: ServerCollectionPageQueryQuery & ServerManyProductsQueryQuery
        serverManyProductsVariables: ServerManyProductsQueryQueryVariables
      }
    | {
        type: 'page'
        slug: string
        page: PageContentType
        serverData?: unknown
      }
  )
