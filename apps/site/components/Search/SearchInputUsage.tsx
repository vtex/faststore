import { useState } from 'react'
import { SearchInputField, SearchInput, SearchProvider } from '@faststore/ui'
import SearchDropdownUsage from 'site/components/Search/SearchDropdownUsage'
import { product } from 'site/mocks/product'

const SearchInputUsage = () => {
  const [searchDropdownVisible, setSearchDropdownVisible] = useState(false)
  const [term, setTerm] = useState('')
  const [products, setProducts] = useState(null)
  function onChangeValue(e) {
    setSearchDropdownVisible(true)
    if (e.target.value == '') {
      setTerm('')
      setProducts(null)
    } else {
      setTerm('App')
      setProducts(product)
    }
  }
  function onClickButton() {
    setSearchDropdownVisible(false)
  }
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
      products={[product]}
    >
      <SearchInput
        visibleDropdown={searchDropdownVisible}
        term={term}
        terms={[
          {
            value: 'apple',
          },
          {
            value: 'apple magic mouse',
          },
        ]}
        products={[product]}
        isLoading={false}
        style={{
          width: '100%',
        }}
      >
        <SearchInputField
          placeholder="Search everything at the store"
          onFocus={() => setSearchDropdownVisible(true)}
          onSubmit={() => setSearchDropdownVisible(false)}
          onChange={(e) => onChangeValue(e)}
          buttonProps={{
            onClick: onClickButton,
          }}
        />
        {searchDropdownVisible && (
          <SearchDropdownUsage term={term} products={products} />
        )}
      </SearchInput>
    </SearchProvider>
  )
}

export default SearchInputUsage
