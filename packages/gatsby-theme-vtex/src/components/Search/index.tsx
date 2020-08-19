/** @jsx jsx */
import { FC, Fragment } from 'react'
import { Flex, Heading, jsx } from '@vtex/store-ui'

import { SearchPageQueryQuery } from '../../templates/__generated__/SearchPageQuery.graphql'
import Container from '../Container'
import CategoryTreeSelector from './Facets/CategoryTree'
import PageList from './PageList'
import { FormattedMessage } from 'react-intl'
// import { t } from 'frenchkiss'

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
        <aside
          sx={{
            my: [0, 4],
            flexGrow: 1,
            flexBasis: 'sidebar',
            minWidth: 250,
            mr: [0, 0, 5],
          }}
        >
          <div sx={{ fontSize: 3 }}>
            <FormattedMessage id="facets.filters" />
            {/* <div>{t('facets.filters')}</div> */}
          </div>
          <hr />
          {search.vtex.facets!.categoriesTrees?.[0] ? (
            <Fragment>
              <CategoryTreeSelector
                tree={search.vtex.facets!.categoriesTrees[0] as any}
              />
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
          <PageList initialData={search} />
        </div>
      </div>
    </Flex>
  </Container>
)

export default SearchTemplate
