/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Flex, Heading, jsx } from 'theme-ui'

import Container from '../Container'
import BrandSelector from './Facets/Brands'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'

interface Props {
  search: any
}

const SearchTemplate: FC<Props> = ({ search }) => (
  <Container>
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading sx={{ fontSize: 6 }} as="h2">
        {search.productSearch.titleTag}
      </Heading>
      <div
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        <aside
          sx={{
            my: [0, 4],
            flexGrow: 1,
            flexBasis: 'sidebar',
            minWidth: 250,
            mr: [0, 0, 5],
          }}
        >
          <div sx={{ fontSize: 3 }}>Filters</div>
          <hr />
          {search.facets.categoriesTrees?.[0] ? (
            <Fragment>
              <CategoryTreeSelector tree={search.facets.categoriesTrees[0]} />
              <hr />
            </Fragment>
          ) : null}
          {search.facets.brands ? (
            <Fragment>
              <BrandSelector brands={search.facets.brands} />
              <hr />
            </Fragment>
          ) : null}
        </aside>
        <div
          sx={{
            flexGrow: 99999,
            flexBasis: 0,
            minWidth: 300,
          }}
        >
          <PageList search={search} />
        </div>
      </div>
    </Flex>
  </Container>
)

export default SearchTemplate
