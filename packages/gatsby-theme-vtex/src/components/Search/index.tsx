/** @jsx jsx */
import { Flex, Heading, jsx } from '@vtex/store-ui'
import { FC } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import Container from '../Container'
import SearchFilters from './Filters'
import PageList from './PageList'

interface Props {
  search: SearchPageQueryQuery
}

const SearchTemplate: FC<Props> = ({ search }) => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading sx={{ fontSize: 6 }} as="h2">
        {search.vtex.productSearch?.titleTag}
      </Heading>
      <div
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <SearchFilters {...(search.vtex.facets as any)} variant="facet" />
        <div
          sx={{
            flexGrow: 99999,
            flexBasis: 0,
            minWidth: 300,
          }}
        >
          <PageList initialData={search} />
        </div>
      </div>
    </Flex>
  </Container>
)

export default SearchTemplate
