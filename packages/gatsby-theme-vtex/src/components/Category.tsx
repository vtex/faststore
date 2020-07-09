/** @jsx jsx */
/* eslint-disable react-hooks/rules-of-hooks */
import { api, Category, Product } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useReducer,
  useState,
} from 'react'
import useSWR from 'swr'
import { Button, Flex, Grid, Heading, jsx } from 'theme-ui'

import { ProductList } from './ProductList'
import { AsyncProductsProvider } from '../providers/AsyncProducts'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const PAGE_SIZE = 10

export const staticQuery = graphql`
  query($id: String!, $categoryId: Int!) {
    category(id: { eq: $id }) {
      name
      slug
      categoryId
    }
    categorySearchResult(categoryId: { eq: $categoryId }) {
      products {
        id
        slug
        productId
        productName
        description
        linkText
        items {
          images {
            imageUrl
            imageText
          }
        }
      }
    }
  }
`

type Action<K, V = void> = V extends void ? { type: K } : { type: K } & V

type Actions =
  | Action<'REFRESH_DATA', { args: { freshData: Product[] } }>
  | Action<
      'ADD_NEW_CLIENT_ITEMS',
      { args: { newItems: Product[]; page: number } }
    >
  | Action<'SET_NEXT_PAGE'>
  | Action<'SET_ERROR'>

interface Props {
  category: Category
  categorySearchResult: {
    products: Product[]
  }
}

interface State {
  staticProducts: Product[]
  dynamicProducts: Product[]
  refreshed: boolean
  productsQueue: Product[]
  currentPage: number
  error: boolean
}

const useRefreshColdData = (
  staticProducts: Product[],
  dispatch: Dispatch<Actions>
) => {
  const { data: freshData } = useSWR(
    api.search({
      productIds: staticProducts.map(({ productId }) => productId),
    }),
    fetcher
  )

  useEffect(() => {
    if (freshData) {
      dispatch({ type: 'REFRESH_DATA', args: { freshData } })
    }
  }, [dispatch, freshData])
}

const initialState: State = {
  staticProducts: [],
  refreshed: false,
  dynamicProducts: [],
  productsQueue: [],
  currentPage: 1,
  error: false,
}

const mergeItems = (
  mainArray: Product[],
  itemsToAdd: Product[],
  maxItems: number
) => {
  const currentItemsIds = new Set(mainArray.map((item) => item.productId))
  const itemsNotInList = itemsToAdd.filter(
    (item) => !currentItemsIds.has(item.productId)
  )
  const newMainArray = [...mainArray]
  const newItemsQueue = []

  for (const item of itemsNotInList) {
    if (newMainArray.length < maxItems) {
      newMainArray.push(item)
    } else {
      newItemsQueue.push(item)
    }
  }

  return { dynamicProducts: newMainArray, productsQueue: newItemsQueue }
}

const reducer = (state: State, action: Actions) => {
  switch (action.type) {
    case 'REFRESH_DATA': {
      const { freshData } = action.args
      const { dynamicProducts, productsQueue } =
        state.productsQueue.length > 0
          ? mergeItems(freshData, state.productsQueue, PAGE_SIZE)
          : { dynamicProducts: freshData, productsQueue: [] }
      return {
        ...state,
        dynamicProducts,
        productsQueue,
        refreshed: true,
      }
    }
    case 'ADD_NEW_CLIENT_ITEMS': {
      const { newItems, page } = action.args
      const isRefreshed = state.refreshed
      const { dynamicProducts, productsQueue } = isRefreshed
        ? mergeItems(state.dynamicProducts, newItems, PAGE_SIZE * page)
        : { dynamicProducts: state.dynamicProducts, productsQueue: newItems }
      return {
        ...state,
        dynamicProducts,
        productsQueue,
      }
    }
    case 'SET_NEXT_PAGE': {
      return {
        ...state,
        currentPage: state.currentPage + 1,
      }
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: true,
      }
    }
    default: {
      return state
    }
  }
}

const initializeState = (args: { staticProducts: Product[] }): State => {
  return {
    ...initialState,
    staticProducts: args.staticProducts,
    refreshed: false,
  }
}

const fetchCategory = (id: number, page: number) => {
  const url = api.search({
    categoryIds: [`${id}`],
    from: (page - 1) * PAGE_SIZE,
    to: page * PAGE_SIZE - 1,
  })
  return fetch(url).then((r) => {
    const totalItems = r.headers.get('resources')?.split('/')?.[1]
    return r.json().then((data: Product[]) => {
      return {
        data,
        totalItems: Number(totalItems ?? 0),
      }
    })
  })
}

const isValidData = (data: any) => data && Array.isArray(data)

const useGetFirstPage = (category: Category, dispatch: Dispatch<Actions>) => {
  useEffect(() => {
    fetchCategory(category.categoryId, 1).then((data) => {
      if (isValidData(data.data)) {
        dispatch({
          type: 'ADD_NEW_CLIENT_ITEMS',
          args: { newItems: data.data, page: 1 },
        })
      }
    })
  }, [category, dispatch])
}

const useLoadMore = (category: Category, dispatch: Dispatch<Actions>) => {
  const [isLoading, setLoading] = useState(false)
  const [hasNext, setHasNext] = useState(true)
  const loadMoreFn = useCallback(
    (page: number) => {
      if (isLoading || !hasNext) {
        return
      }

      setLoading(true)
      fetchCategory(category.categoryId, page)
        .then((data) => {
          if (!isValidData(data.data)) {
            return
          }
          dispatch({
            type: 'ADD_NEW_CLIENT_ITEMS',
            args: { newItems: data.data, page },
          })
          dispatch({ type: 'SET_NEXT_PAGE' })
          const nextPageStart = page * PAGE_SIZE
          if (nextPageStart >= data.totalItems) {
            setHasNext(false)
          }
        })
        .catch(() => {
          console.error('error fetching page: ', page)
          dispatch({ type: 'SET_ERROR' })
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [isLoading, hasNext, category.categoryId, dispatch]
  )
  return {
    isLoadingMore: isLoading,
    loadMore: loadMoreFn,
    hasNext,
  }
}

// TODO - prefetch next pages when button is seen

const CategoryTemplate: FC<Props> = ({ categorySearchResult, category }) => {
  const syncProducts = categorySearchResult.products
  const [state, dispatch] = useReducer(
    reducer,
    { staticProducts: syncProducts },
    initializeState
  )
  useRefreshColdData(syncProducts, dispatch)
  useGetFirstPage(category, dispatch)
  const { isLoadingMore, loadMore, hasNext } = useLoadMore(category, dispatch)

  const filterOptions = {
    productIds: state.dynamicProducts.map((p) => p.productId),
  }

  return (
    <AsyncProductsProvider
      filterOptions={filterOptions}
      syncProducts={state.dynamicProducts}
    >
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h1">{category.name}</Heading>
        <Grid marginY={4} gap={3} columns={[2, null, 4]}>
          <ProductList syncProducts={state.dynamicProducts} />
        </Grid>
        {state.error ? (
          <p>não foi possível carregar os produtos</p>
        ) : (
          hasNext && (
            <Button
              variant="loadMore"
              onClick={() => loadMore(state.currentPage + 1)}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? 'Carregando...' : 'Carregar mais'}
            </Button>
          )
        )}
      </Flex>
    </AsyncProductsProvider>
  )
}

export default CategoryTemplate
