/** @jsx jsx */
/* eslint-disable react-hooks/rules-of-hooks */
import { Category, Product, api } from '@vtex/gatsby-source-vtex'
import { graphql } from 'gatsby'
import {
  FC,
  useState,
  useEffect,
  useReducer,
  useCallback,
  Dispatch,
} from 'react'
import useSWR from 'swr'
import { Button, Flex, Heading, Grid, jsx } from 'theme-ui'

import Layout from '../components/Layout'
import { ProductList } from '../components/ProductList'
import SEO from '../components/Seo'

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
  data: {
    category: Category
    categorySearchResult: {
      products: Product[]
    }
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
    api.search.byFilters({
      productIds: staticProducts.map(({ productId }) => productId),
    }),
    fetcher
  )

  useEffect(() => {
    if (freshData) {
      dispatch({ type: 'REFRESH_DATA', args: { freshData } })
    }
  }, [freshData, dispatch])
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
  const url = api.search.byFilters({
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
          if (isValidData(data.data)) {
            dispatch({
              type: 'ADD_NEW_CLIENT_ITEMS',
              args: { newItems: data.data, page },
            })
            dispatch({ type: 'SET_NEXT_PAGE' })
            const nextPageStart = page * PAGE_SIZE
            if (nextPageStart >= data.totalItems) {
              setHasNext(false)
            }
          }

          return null
        })
        .catch(() => dispatch({ type: 'SET_ERROR' }))
        .finally(() => setLoading(false))
    },
    [category, isLoading, hasNext, dispatch]
  )
  return {
    isLoadingMore: isLoading,
    loadMore: loadMoreFn,
    hasNext,
  }
}

// TODO - prefetch next pages when button is seen

const CategoryTemplate: FC<Props> = ({ data }) => {
  const staticProducts = data.categorySearchResult.products
  const [state, dispatch] = useReducer(
    reducer,
    { staticProducts },
    initializeState
  )
  useRefreshColdData(staticProducts, dispatch)
  useGetFirstPage(data.category, dispatch)
  const { isLoadingMore, loadMore, hasNext } = useLoadMore(
    data.category,
    dispatch
  )

  return (
    <Layout>
      <SEO title={data.category.name} />
      <Flex sx={{ flexDirection: 'column' }} my={4}>
        <Heading as="h1">{data.category.name}</Heading>
        <Grid marginY={4} gap={3} columns={[2, null, 4]}>
          <ProductList
            staticProducts={staticProducts}
            dynamicProducts={state.dynamicProducts.map((product) => ({
              ...product,
              id: product.productId,
              slug: `/${product.linkText}/p`,
            }))}
          />
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
    </Layout>
  )
}

export default CategoryTemplate
