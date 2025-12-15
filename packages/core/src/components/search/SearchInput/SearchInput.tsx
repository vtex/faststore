import type { CSSProperties, SetStateAction } from 'react'
import {
  Suspense,
  forwardRef,
  lazy,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import type { SearchEvent, SearchState } from '@faststore/sdk'

import {
  FileUploadCard,
  QuickOrderDrawer,
  QuickOrderDrawerFooter,
  QuickOrderDrawerHeader,
  QuickOrderDrawerProducts,
  Icon as UIIcon,
  IconButton as UIIconButton,
  SearchInput as UISearchInput,
  useOnClickOutside,
  type CSVData,
  type Product,
} from '@faststore/ui'

import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'

import type { SearchProviderContextValue } from '@faststore/ui'

import type { NavbarProps } from 'src/components/sections/Navbar'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSuggestions from 'src/sdk/search/useSuggestions'

import { cartStore } from 'src/sdk/cart'
import { convertProductToQuickOrder } from 'src/sdk/product/convertProductToQuickOrder'
import { useBulkProductsQuery } from 'src/sdk/product/useBulkProductsQuery'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'
import { formatFileName, formatFileSize } from 'src/utils/utilities'

const SearchDropdown = lazy(
  /* webpackChunkName: "SearchDropdown" */
  () => import('src/components/search/SearchDropdown')
)

const UISearchInputField = dynamic<UISearchInputFieldProps & any>(() =>
  /* webpackChunkName: "UISearchInputField" */
  import('@faststore/ui').then((module) => module.SearchInputField)
)

const MAX_SUGGESTIONS = 5

export type SearchInputProps = {
  onSearchClick?: () => void
  buttonTestId?: string
  containerStyle?: CSSProperties
  placeholder?: string
  quickOrderSettings?: NavbarProps['searchInput']['quickOrderSettings']
  sort?: string
  showAttachmentButton?: boolean
  attachmentButtonIcon?: {
    icon: string
    alt: string
  }
  attachmentButtonAriaLabel?: string
} & Omit<UISearchInputFieldProps, 'onSubmit'>

export type SearchInputRef = UISearchInputFieldRef & {
  resetSearchInput: () => void
}

const sendAnalytics = async (term: string) => {
  import('@faststore/sdk').then(({ sendAnalyticsEvent }) => {
    sendAnalyticsEvent<SearchEvent>({
      name: 'search',
      params: { search_term: term },
    })
  })
}

const SearchInput = forwardRef<SearchInputRef, SearchInputProps>(
  function SearchInput(
    {
      onSearchClick,
      buttonTestId = 'fs-search-button',
      containerStyle,
      sort,
      placeholder,
      quickOrderSettings,
      showAttachmentButton = false,
      attachmentButtonIcon,
      attachmentButtonAriaLabel,
      ...otherProps
    },
    ref
  ) {
    const { hidden } = otherProps
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
    const [
      customSearchDropdownVisibleCondition,
      setCustomSearchDropdownVisibleCondition,
    ] = useState<boolean>(false)
    const searchQueryDeferred = useDeferredValue(searchQuery)
    const [searchDropdownVisible, setSearchDropdownVisible] =
      useState<boolean>(false)
    const [fileUploadVisible, setFileUploadVisible] = useState<boolean>(false)
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [hasFile, setHasFile] = useState(false)
    const [isQuickOrderDrawerOpen, setIsQuickOrderDrawerOpen] = useState(false)
    const [quickOrderProducts, setQuickOrderProducts] = useState<Product[]>([])

    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()

    const [csvData, setCsvData] = useState<CSVData | null>(null)
    const [skusToFetch, setSkusToFetch] = useState<string[]>([])

    const {
      error: csvError,
      isProcessing: isCsvProcessing,
      onParseFile,
      onClearError,
      onGenerateTemplate,
    } = useCSVParser({
      delimiter: ',',
      skipEmptyLines: true,
    })

    useImperativeHandle(ref, () => ({
      resetSearchInput: () => setSearchQuery(''),
    }))

    const onSearchSelection: SearchProviderContextValue['onSearchSelection'] = (
      term,
      path
    ) => {
      addToSearchHistory({ term, path })
      sendAnalytics(term)
      setSearchDropdownVisible(false)
    }

    const handleFileSelect = async (files: File[]) => {
      if (files.length === 0) return

      setHasFile(true)

      onClearError()
      const file = files[0]

      const result = await onParseFile(file)

      setIsUploadOpen(true)

      if (result) {
        setCsvData(result)
        // TODO: Use the parsed data for bulk search
        console.log('CSV Data processed in Worker:', result.data)
      }
    }

    const handleDownloadTemplate = async () => {
      try {
        const csvContent = await onGenerateTemplate()

        if (csvContent) {
          const blob = new Blob([csvContent], { type: 'text/csv' })
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'template.csv'
          a.click()
          window.URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Failed to download template:', error)
      }
    }

    const handleDismiss = () => {
      setCsvData(null)
      setFileUploadVisible(false)
      onClearError()
    }

    const handleSearch = () => {
      if (!csvData) return

      // Extract SKUs from CSV data
      const skus = csvData.data.map((item: { SKU: string }) => item.SKU)
      setSkusToFetch(skus)
    }

    // Fetch products when SKUs are available
    const { products: fetchedProducts, isLoading: isLoadingProducts } =
      useBulkProductsQuery(skusToFetch)

    // Convert fetched products to QuickOrder format when available
    useEffect(() => {
      if (fetchedProducts.length > 0 && skusToFetch.length > 0) {
        const convertedProducts: Product[] = []

        fetchedProducts.forEach((productData) => {
          if (productData.product && !productData.error) {
            // Find the requested quantity for this SKU
            const csvItem = csvData?.data.find(
              (item: { SKU: string; Quantity: number }) =>
                item.SKU === productData.sku
            )
            const requestedQuantity = csvItem?.Quantity ?? 1

            const convertedProduct = convertProductToQuickOrder(
              productData.product,
              requestedQuantity
            )

            if (convertedProduct) {
              convertedProducts.push(convertedProduct)
            }
          }
        })

        setQuickOrderProducts(convertedProducts)

        // Open drawer if we have products
        if (convertedProducts.length > 0) {
          setIsQuickOrderDrawerOpen(true)
          setFileUploadVisible(false)
        }
      }
    }, [fetchedProducts, skusToFetch, csvData])

    useOnClickOutside(searchRef, () => {
      setSearchDropdownVisible(customSearchDropdownVisibleCondition ?? false)
      setFileUploadVisible(false)
    })

    const { data, error } = useSuggestions(searchQueryDeferred)
    const terms = (data?.search.suggestions.terms ?? []).slice(
      0,
      MAX_SUGGESTIONS
    )
    const products = (data?.search.suggestions.products ?? []).slice(
      0,
      MAX_SUGGESTIONS
    )
    const isLoading = !error && !data

    const buttonProps = {
      onClick: onSearchClick,
      testId: buttonTestId,
    }

    return (
      <>
        {hidden ? (
          <UIIconButton
            type="submit"
            aria-label="Submit Search"
            icon={<UIIcon name="MagnifyingGlass" />}
            size="small"
            {...buttonProps}
          />
        ) : (
          <UISearchInput
            ref={searchRef}
            visibleDropdown={searchDropdownVisible}
            onSearchSelection={onSearchSelection}
            term={searchQueryDeferred}
            terms={terms}
            products={products}
            isLoading={isLoading}
          >
            <UISearchInputField
              ref={ref}
              showUploadButton
              onUploadClick={() => setIsUploadModalOpen((prev) => !prev)}
              buttonProps={buttonProps}
              placeholder={placeholder}
              showAttachmentButton={showAttachmentButton}
              attachmentButtonIcon={
                showAttachmentButton && attachmentButtonIcon ? (
                  <UIIcon
                    name={attachmentButtonIcon.icon}
                    aria-label={attachmentButtonIcon.alt}
                  />
                ) : undefined
              }
              attachmentButtonProps={{
                onClick: () => setFileUploadVisible(true),
                'aria-label':
                  attachmentButtonAriaLabel ??
                  attachmentButtonIcon?.alt ??
                  'Attach File',
              }}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setSearchQuery(e.target.value)
              }
              onSubmit={(term: string) => {
                const path = formatSearchPath({
                  term,
                  sort: sort as SearchState['sort'],
                })

                onSearchSelection(term, path)
                router.push(path)
              }}
              onFocus={() => setSearchDropdownVisible(true)}
              value={searchQuery}
              {...otherProps}
            />

            {searchDropdownVisible && (
              <Suspense fallback={null}>
                <SearchDropdown
                  sort={sort as SearchState['sort']}
                  quickOrderSettings={quickOrderSettings}
                  onChangeCustomSearchDropdownVisible={
                    setCustomSearchDropdownVisibleCondition
                  }
                />
              </Suspense>
            )}

            {fileUploadVisible && (
              <FileUploadCard
                isOpen={isUploadOpen || hasFile || fileUploadVisible}
                onDismiss={handleDismiss}
                onFileSelect={handleFileSelect}
                onDownloadTemplate={handleDownloadTemplate}
                formatterFileSize={formatFileSize}
                formatterFileName={formatFileName}
                onSearch={handleSearch}
                isUploading={isCsvProcessing || isLoadingProducts}
                hasError={!!csvError}
              />
            )}
          </UISearchInput>
        )}

        <QuickOrderDrawer
          isOpen={isQuickOrderDrawerOpen}
          overlayProps={{
            onClick: () => setIsQuickOrderDrawerOpen(false),
          }}
          providerProps={{
            initialProducts: quickOrderProducts,
            onAddToCart: (productsToAdd: Product[]) => {
              // Convert products to cart items and add to cart
              productsToAdd.forEach((product: Product) => {
                if (
                  product.selectedCount > 0 &&
                  product.availability === 'available'
                ) {
                  // Find the corresponding fetched product to get full details
                  const fetchedProduct = fetchedProducts.find(
                    (p) => p.product?.sku === product.id
                  )?.product

                  if (fetchedProduct && fetchedProduct.offers?.offers[0]) {
                    const offer = fetchedProduct.offers.offers[0]

                    cartStore.addItem({
                      itemOffered: {
                        sku: fetchedProduct.sku,
                        name: fetchedProduct.name,
                        unitMultiplier: fetchedProduct.unitMultiplier ?? 1,
                        image: fetchedProduct.image,
                        brand: fetchedProduct.brand,
                        isVariantOf: fetchedProduct.isVariantOf,
                        gtin: fetchedProduct.gtin,
                        additionalProperty: fetchedProduct.additionalProperty,
                      },
                      seller: offer.seller,
                      quantity: product.selectedCount,
                      price: product.price,
                      listPrice: offer.listPrice ?? product.price,
                      priceWithTaxes: offer.priceWithTaxes ?? product.price,
                      listPriceWithTaxes:
                        offer.listPriceWithTaxes ?? product.price,
                    })
                  }
                }
              })

              setIsQuickOrderDrawerOpen(false)
            },
          }}
        >
          <QuickOrderDrawerHeader
            title="Quick Order"
            onCloseDrawer={() => setIsQuickOrderDrawerOpen(false)}
          />
          <QuickOrderDrawerProducts
            columns={{
              name: 'Product',
              availability: {
                label: 'Availability',
                stockDisplaySettings: 'showAvailability',
              },
              price: 'Price',
              quantity: 'Quantity',
            }}
          />
          <QuickOrderDrawerFooter />
        </QuickOrderDrawer>
      </>
    )
  }
)

export default SearchInput
