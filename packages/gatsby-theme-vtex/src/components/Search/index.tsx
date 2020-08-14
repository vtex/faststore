/** @jsx jsx */
import { Flex, Heading, jsx, Box } from '@vtex/store-ui'
import { FC } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import Container from '../Container'
import DesktopSearchFilters from './Filters/Desktop'
import MobileSearchFilters from './Filters/Mobile'
import PageList from './PageList'
import SortSelect from './SortSelect'

interface Props {
  search: SearchPageQueryQuery
}

const SearchTemplate: FC<Props> = ({ search }) => {
  return (
    <Container>
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading sx={{ fontSize: 6 }} as="h2">
          {search.vtex.productSearch!.titleTag}
        </Heading>

        <div
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          {/* Desktop Filters */}
          <Box variant="filters.desktop">
            <aside>
              <DesktopSearchFilters
                {...(search.vtex.facets as any)}
                variant="filters.desktop"
              />
            </aside>
          </Box>

          <div
            sx={{
              flexGrow: 99999,
              flexBasis: 0,
              minWidth: 300,
              ml: [0, '1rem'],
            }}
          >
            {/* Mobile Controls */}
            <Box
              sx={{
                display: ['block', 'none'],
              }}
            >
              <Flex variant="controls.mobile">
                <SortSelect variant="sortSelect.mobile" />
                <MobileSearchFilters
                  {...(search.vtex.facets as any)}
                  variant="filters.mobile"
                />
              </Flex>
              <Box variant="totalCount.mobile">
                <span>{search.vtex.productSearch!.recordsFiltered}</span>{' '}
                PRODUCTS
              </Box>
            </Box>

            {/* Desktop Controls */}
            <Flex
              sx={{
                justifyContent: 'space-between',
                alignItems: 'center',
                display: ['none', 'flex'],
              }}
            >
              <Box variant="totalCount">
                <span>{search.vtex.productSearch!.recordsFiltered}</span>{' '}
                PRODUCTS
              </Box>
              <SortSelect variant="sortSelect.desktop" />
            </Flex>

            {/* Product List  */}
            <PageList initialData={search} />
          </div>
        </div>
      </Flex>
    </Container>
  )
}

export default SearchTemplate
