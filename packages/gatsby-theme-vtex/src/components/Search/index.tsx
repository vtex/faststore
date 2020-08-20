/** @jsx jsx */
import { Flex, Breadcrumb, jsx, Box, NavigationItem } from '@vtex/store-ui'
import { FC, lazy, useMemo } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import PageList from './PageList'
import Container from '../Container'
import SuspenseDevice from '../SuspenseDevice'
import SEO from '../SEO/siteMetadata'
import Controls from './Controls'

const DesktopSearchFilters = lazy(() => import('./Filters/Desktop'))

interface Props {
  data: SearchPageQueryQuery
}

const SearchTemplate: FC<Props> = ({ data }) => {
  const breadcrumb = useMemo(
    () => (data.vtex.productSearch!.breadcrumb! || []) as NavigationItem[],
    [data]
  )

  return (
    <Container>
      <SEO title={data.vtex.productSearch!.titleTag!} />
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Breadcrumb breadcrumb={breadcrumb} />

        <div
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
          }}
        >
          <aside
            sx={{
              display: ['none', 'block'],
              flexGrow: 1,
              flexBasis: 'sidebar',
              width: 230,
            }}
          >
            {/* Desktop Filters */}
            <Box variant="searchFilter.desktop">
              <SuspenseDevice device="desktop" fallback={null}>
                <DesktopSearchFilters
                  {...(data.vtex.facets as any)}
                  variant="desktop"
                />
              </SuspenseDevice>
            </Box>
          </aside>

          <div
            sx={{
              flexGrow: 99999,
              flexBasis: 0,
              minWidth: 300,
              ml: [0, '3rem'],
            }}
          >
            {/* Controls */}
            <Controls data={data} />

            {/* Product List  */}
            <PageList initialData={data} />
          </div>
        </div>
      </Flex>
    </Container>
  )
}

export default SearchTemplate
