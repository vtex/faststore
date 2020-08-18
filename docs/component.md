# Component

Some people think React is the V of MVC, which is a good argument; however, it doesn't make sense to us, as we don't want to have components attached, but we still want to have access to the data. So React is the MVC's C, and V. [Dan Abramov describes the division as intelligent, silent components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)..

Such a component would be rejected in the code review for having a concern for presentation and data:

```tsx
// ProductList.tsx
import React from 'react'
import {
  ProductListQuery,
  ProductListQueryQuery,
  ProductListQueryQueryVariables,
} from './__generated__/useAsyncProductQuery.graphql'
import { useQuery } from './useQuery'

export const ProductList = () => {
  const [productSelected, setProductSelected] = useState('product 1')
  const onSelect = ({ name }) => setSelected(name)
  const { data } = useQuery<
    ProductListQueryQuery,
    ProductListQueryQueryVariables
  >({
    ...ProductListQuery,
    variables: {},
    suspense: false,
  })

  return (
    <ul
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      {data.productList.map((product) => (
        <li
          key={product.name}
          onClick={() => setProductSelected(product.name)}
          style={
            productSelected === product.name
              ? { color: 'blue', cursor: 'pointer' }
              : { cursor: 'pointer' }
          }
        >
          {product.name}
        </li>
      ))}
    </ul>
  )
}
```

## Refactoring

Components must be combinable and should have only a single responsibility ([SRP](https://en.wikipedia.org/wiki/Single-responsibility_principle)) to help achieve separation of interests ([SOC](https://en.wikipedia.org/wiki/Separation_of_concerns)). In our example, there are several responsibilities / concerns: searching for data and rendering different UI states. Our component should be divided into parts:

- The first is like a traditional component, concerned only with the presentation;
- The second is responsible of data fetching and state control;
- And finally the third one, which is responsible for rendering the related display component.

```tsx
// ProductList.tsx
import React, { FC } from 'react'
import { Box } from '@vtex/store-ui'

interface Product {
  name: string
}

interface Props {
  data: Product[]
  productSelected: string
  onSelect: () => void
  variant?: string
}

const ProductList: FC<Props> = ({
  data,
  productSelected,
  onSelect = () => null,
  variant,
}) => {
  const customVariant = variant ? `${variant}.productList` : 'productList'

  return (
    <Box as="ul" variant={customVariant}>
      {data.map((product) => (
        <Box
          as="li"
          key={product.name}
          onClick={() => onSelect(product)}
          variant={`${customVariant}.item`}
          className={productSelected === product.name ? 'active' : ''}
        >
          {product.name}
        </Box>
      ))}
    </Box>
  )
}

export default ProductList
```

```tsx
// useProductList.tsx
import React from 'react'
import {
  ProductListQuery,
  ProductListQueryQuery,
  ProductListQueryQueryVariables,
} from './__generated__/useAsyncProductQuery.graphql'
import { useQuery } from './useQuery'
import ProductList from './ProudctList'

export const useProductList = () => {
  const { data } = useQuery<
    ProductListQueryQuery,
    ProductListQueryQueryVariables
  >({
    ...ProductListQuery,
    variables: {},
    suspense: false,
  })
  const [productSelected, setSelected] = useState('')
  const onSelect = ({ name }) => setSelected(name)

  return {
    data: data.productList,
    productSelected,
    onSelect,
  }
}
```

```tsx
// ProductListContainer.tsx
import React from 'react'
import ProductList from './ProductList'
import useProductList from './useProductList'

const ProductListContainer = () => {
  const productList = useProductList()

  return <ProductList {...productList} />
}

export default ProductListContainer
```

## Architecture

The 3 files must be in the components folder like this:

- `ProductList.tsx` - Component
- `ProductListContainer.tsx` - Container
- `useProductList.tsx` - Custom Hook

## Styling

Note that the `ProductList.tsx` file after being refactored now receives a prop called `variant`. This in turn is responsible for styling using [Theme-UI Variants](https://theme-ui.com/guides/variants). The theme file would look like this:

```ts
// example theme with variants
{
  productList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,

    item: {
      color: 'black',

      '&.active': {
        color: 'blue'
      }
    }
  }
}
```

## Links

- https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0
- https://reactjs.org/docs/hooks-custom.html
- https://medium.com/trabe/using-renderless-components-in-react-to-handle-data-4c55f1e94dd4
- https://theme-ui.com/guides/variants
