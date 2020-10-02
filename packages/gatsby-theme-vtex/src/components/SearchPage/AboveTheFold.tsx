/** @jsx jsx */
import { Text, Center, jsx } from '@vtex/store-ui'
import { FC, Fragment } from 'react'

import { SearchPageProps } from '../../templates/search'
import {
  SearchTemplateAside,
  SearchTemplateContainer,
  SearchTemplateMain,
} from '../Search/SearchTemplate'
import SuspenseDevice from '../Suspense/Device'

const AboveTheFold: FC<SearchPageProps> = () => (
  <Fragment>
    <Center height="150px">
      <Text sx={{ width: '50%' }}>
        This is the Above the fold part of your search template. All sync items
        should be rendered in here. Thus, make sure all data rendered in this
        part is fetched during Server Side Rendering and revalidated on the
        client if necessary. All data is available via props
      </Text>
    </Center>

    <SearchTemplateContainer>
      <SearchTemplateAside>
        <SuspenseDevice device="desktop" fallback={null}>
          <Center height="150px">
            <Text sx={{ width: '50%' }}>
              This is where the desktop filters should fit. Note that Desktop
              filters are lazy loaded and not SSR, thus this component should be
              dynamically imported via React.lazy
            </Text>
          </Center>
        </SuspenseDevice>
      </SearchTemplateAside>

      <SearchTemplateMain>
        <Center height="150px">
          <Text sx={{ width: '50%' }}>
            This is where the product list should be loaded. Note that a huge
            number of products delay the first paint, thus harming hugely the
            performance mainly in mobile devices. A good number varies from 8 to
            16 depending on your case
          </Text>
        </Center>
      </SearchTemplateMain>
    </SearchTemplateContainer>
  </Fragment>
)

export default AboveTheFold
