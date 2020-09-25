/** @jsx jsx */
import { Text, Center, jsx } from '@vtex/store-ui'
import { FC, Fragment } from 'react'

import { Props } from '../../templates/search'

const format = (x: string) =>
  x.length > 100 ? `${x.slice(0, 100)} ...Truncated` : x

const AboveTheFold: FC<Props> = (props) => (
  <Fragment>
    <Center height="150px">
      <Text sx={{ width: '50%' }}>
        This is the Above the fold part of your search template. All sync items
        should be rendered in here. Thus, make sure all data rendered in this
        part is fetched during Server Side Rendering and revalidated on the
        client if necessary
      </Text>
    </Center>

    <Center height="150px">
      <Text sx={{ width: '50%' }}>
        Product info will be available via the
        &quot;data.vtex.productSearch&quot; prop. Also, if you want to fetch
        more fields, you can add these fields in the
        &quot;ProductSummary_syncProduct&quot; fragment. These fields will be
        available in the same prop as above.
      </Text>
    </Center>

    <Center>
      <Text sx={{ width: '50%' }}>
        Currently, this page&apos;s props are:
        <ul>
          {Object.keys(props)
            .filter(
              (k) =>
                typeof (props as any)[k] === 'object' ||
                typeof (props as any)[k] === 'string' ||
                typeof (props as any)[k] === 'number'
            )
            .map((key) => (
              <li key={key}>
                {key}: {format(JSON.stringify((props as any)[key]))}
              </li>
            ))}
        </ul>
      </Text>
    </Center>
  </Fragment>
)

export default AboveTheFold
