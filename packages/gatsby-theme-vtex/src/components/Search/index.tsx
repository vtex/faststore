/** @jsx jsx */
import { Flex, Heading, jsx } from '@vtex/store-ui'
import { FC } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import Container from '../Container'
import Facets from './Facet'
import PageList from './PageList'

interface Props {
  search: SearchPageQueryQuery
}

const convert = (facets: SearchPageQueryQuery['vtex']['facets']) =>
  facets?.facets?.filter((f) => !!f?.name) ?? []

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
        <Facets
          allFacets={convert(search.vtex.facets) as any}
          variant="facet"
        />
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
