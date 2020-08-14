/** @jsx jsx */
import { Flex, Heading, jsx, Box } from '@vtex/store-ui'
import { FC, lazy } from 'react'
import { FormattedMessage } from 'react-intl'

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

const SearchTemplate: FC<Props> = ({ data }) => (
  <Container>
    <SEO title={data.vtex.productSearch!.titleTag!} />
    <Flex sx={{ flexDirection: 'column' }} my={4}>
      <Heading sx={{ fontSize: 6 }} as="h2">
        {data.vtex.productSearch!.titleTag}
      </Heading>

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
<<<<<<< HEAD
          {/* Desktop Filters */}
          <Box variant="searchFilter.desktop">
            <SuspenseDevice device="desktop" fallback={null}>
              <DesktopSearchFilters
                {...(data.vtex.facets as any)}
                variant="desktop"
=======
          <div sx={{ fontSize: 3 }}>
            <FormattedMessage id="facets.filters" />
          </div>
          <hr />
          {search.vtex.facets!.categoriesTrees?.[0] ? (
            <Fragment>
              <CategoryTreeSelector
                tree={search.vtex.facets!.categoriesTrees[0] as any}
>>>>>>> use gatsby-theme-i18n
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

export default SearchTemplate
