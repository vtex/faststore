/* eslint-disable @next/next/no-img-element */
import {
  SearchDropdown,
  SearchHistory,
  SearchHistoryTerm,
  SearchTop,
  SearchTopTerm,
  SearchAutoComplete,
  SearchAutoCompleteTerm,
  SearchProducts,
  SearchProductItem,
  SearchProductItemImage,
  SearchProductItemContent,
  SearchProvider,
} from '@faststore/ui'

import { useFormattedPrice } from 'site/components/utilities/usePriceFormatter'
import { product } from 'site/mocks/product'

export interface SearchDropdownUsageProps {
  term: string
  products?: [] | null
}

const SearchHistoryUsage = () => {
  return (
    <SearchHistory title="History">
      <SearchHistoryTerm value="Headphone" linkProps={{ href: '#' }} />
      <SearchHistoryTerm value="Audio & Video" linkProps={{ href: '#' }} />
      <SearchHistoryTerm value="mh-7000" linkProps={{ href: '#' }} />
    </SearchHistory>
  )
}

const SearchTopUsage = () => {
  return (
    <SearchTop title="Top Search">
      <SearchTopTerm value="Notebooks" linkProps={{ href: '#' }} index={0} />
      <SearchTopTerm
        value="Laser Printer"
        linkProps={{ href: '#' }}
        index={1}
      />
      <SearchTopTerm
        value="Bluetooth Keyboard"
        linkProps={{ href: '#' }}
        index={2}
      />
    </SearchTop>
  )
}

const SearchAutoCompleteUsage = () => {
  const searchContent = 'Appl'
  const suggestions = [{ value: 'apple' }, { value: 'apple magic mouse' }]
  return (
    <SearchAutoComplete>
      {suggestions?.map((suggestion) => (
        <SearchAutoCompleteTerm
          key={suggestion.value}
          term={searchContent}
          suggestion={suggestion.value}
          linkProps={{ href: '#' }}
        />
      ))}
    </SearchAutoComplete>
  )
}

const SearchProductsUsage = () => {
  return (
    <SearchProducts>
      <SearchProductItem linkProps={{ href: '#' }}>
        <SearchProductItemImage>
          <img
            data-fs-image
            src={product.image[1].url}
            alt={product.image[1].alternateName}
          />
        </SearchProductItemImage>
        <SearchProductItemContent
          title={product.isVariantOf.name}
          price={{
            value: product.offers.offers[0].price,
            listPrice: product.offers.offers[0].listPrice,
            formatter: useFormattedPrice,
          }}
        />
      </SearchProductItem>
      <SearchProductItem linkProps={{ href: '#' }}>
        <SearchProductItemImage>
          <img
            data-fs-image
            src={product.image[1].url}
            alt={product.image[1].alternateName}
          />
        </SearchProductItemImage>
        <SearchProductItemContent
          title={product.isVariantOf.name}
          price={{
            value: product.offers.offers[0].price,
            listPrice: product.offers.offers[0].listPrice,
            formatter: useFormattedPrice,
          }}
        />
      </SearchProductItem>
    </SearchProducts>
  )
}

const SearchDropdownUsage = ({
  term = '',
  products = [],
}: SearchDropdownUsageProps) => {
  return (
    <SearchProvider
      term={term}
      terms={[
        {
          value: 'apple',
        },
        {
          value: 'apple magic mouse',
        },
      ]}
      isLoading={false}
      products={products}
    >
      <SearchDropdown
        style={{
          position: 'relative',
          top: 'auto',
          left: 'auto',
        }}
      >
        <SearchHistoryUsage />
        <SearchTopUsage />
        <SearchAutoCompleteUsage />

        {products && <SearchProductsUsage />}
      </SearchDropdown>
    </SearchProvider>
  )
}

export default SearchDropdownUsage
