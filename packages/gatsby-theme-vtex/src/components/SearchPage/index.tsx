/** @jsx jsx */
import { Flex, Breadcrumb, BreadcrumbItem, jsx, Box } from '@vtex/store-ui'
import { FC, lazy } from 'react'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import PageList from './PageList'
import Container from '../Container'
import SuspenseDevice from '../Suspense/Device'
import SEO from '../SEO/siteMetadata'
import Controls from './Controls'

const DesktopSearchFilters = lazy(() => import('./Filters/Desktop'))

export interface Props {
  data: SearchPageQueryQuery
  columns?: number[]
  pageSize?: number
}

const DEFAULT_COLUMNS = [2, 3, 5]

const SearchTemplate: FC<Props> = ({
  data,
  pageSize,
  columns = DEFAULT_COLUMNS,
}) => {
  const breadcrumb = (data.vtex.facets?.breadcrumb ?? []) as BreadcrumbItem[]

  return (
    <Container>
      <SEO title={data.vtex.productSearch!.titleTag!} />
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Breadcrumb breadcrumb={breadcrumb} type="SEARCH" />

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
            <PageList
              pageSize={pageSize}
              initialData={data}
              columns={columns}
            />
          </div>
        </div>
      </Flex>
    </Container>
  )
}

export default SearchTemplate
