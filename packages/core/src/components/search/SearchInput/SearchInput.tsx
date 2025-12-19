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
  useCSVParser,
  useOnClickOutside,
  useUI,
  type CSVData,
  type FileUploadErrorType,
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
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'
import { formatSearchPath } from 'src/sdk/search/formatSearchPath'
import { formatFileName, formatFileSize } from 'src/utils/utilities'

const SearchDropdown = lazy(
  /* webpackChunkName: "SearchDropdown" */
  () => import('src/components/search/SearchDropdown')
)

const UploadFileDropdown = lazy(
  /* webpackChunkName: "UploadFileDropdown" */
  () => import('src/components/search/UploadFileDropdown')
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
} & Omit<UISearchInputFieldProps, 'onSubmit' | 'attachmentButtonIcon'>

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
    const [noProductsError, setNoProductsError] = useState<boolean>(false)

    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()
    const priceFormatter = usePriceFormatter()
    const { pushToast } = useUI()

    const [csvData, setCsvData] = useState<CSVData | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [skusToFetch, setSkusToFetch] = useState<string[]>([])

    const {
      error: csvError,
      isProcessing: isCsvProcessing,
      onParseFile,
      onClearError,
      onGenerateTemplate,
    } = useCSVParser({
      delimiter: '',
      skipEmptyLines: true,
    })

    useImperativeHandle(ref, () => ({
      resetSearchInput: () => setSearchQuery(''),
    }))

    // Map CSV parser error types to FileUploadErrorType
    const mapCSVErrorToFileUploadErrorType = (
      csvErrorType?: string
    ): FileUploadErrorType => {
      if (csvErrorType === 'FILE_ERROR') {
        return 'unreadable'
      }
      return 'invalid-structure'
    }

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
      setIsUploadOpen(true)

      const file = files[0]
      setSelectedFile(file)

      onClearError()
      setCsvData(null)
      setQuickOrderProducts([])
      setSkusToFetch([])
      setIsQuickOrderDrawerOpen(false)
      setNoProductsError(false)

      const result = await onParseFile(file)

      if (result && result.data && result.data.length > 0) {
        setCsvData(result)
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
        // Error handled silently
      }
    }

    const handleDismiss = () => {
      setCsvData(null)
      setSelectedFile(null)
      setSkusToFetch([])
      setQuickOrderProducts([])
      setFileUploadVisible(false)
      setIsUploadOpen(false)
      setHasFile(false)
      setNoProductsError(false)
      onClearError()
    }

    const handleSearch = async (_file?: File) => {
      let dataToUse = csvData

      if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
        const fileToParse = _file || selectedFile

        if (!fileToParse) {
          pushToast({
            title: 'No file selected',
            message: 'Please select a CSV file to search.',
            status: 'ERROR',
            icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
          })
          return
        }

        try {
          const parsePromise = onParseFile(fileToParse)

          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(
                new Error(
                  'The file may be too large, corrupted, or the parser may be stuck.'
                )
              )
            }, 30000)
          })

          const result = (await Promise.race([
            parsePromise,
            timeoutPromise,
          ])) as Awaited<ReturnType<typeof onParseFile>>

          if (result && result.data && result.data.length > 0) {
            dataToUse = result
            setCsvData(result)
          } else {
            pushToast({
              title: 'No data found',
              message:
                'The CSV file could not be processed or contains no valid data. Please check the file format and try again.',
              status: 'ERROR',
              icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
            })
            return
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : 'Failed to process the CSV file. Please try again.'
          pushToast({
            title: 'File processing error',
            message: errorMessage,
            status: 'ERROR',
            icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
          })
          return
        }
      }

      if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
        pushToast({
          title: 'No data available',
          message:
            'The CSV file contains no valid data. Please check the file and try again.',
          status: 'ERROR',
          icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
        })
        return
      }

      const skus = dataToUse.data
        .map((item: { SKU: string }) => item.SKU)
        .filter(Boolean)

      if (skus.length === 0) {
        pushToast({
          title: 'No valid SKUs found',
          message:
            'The CSV file does not contain any valid SKUs. Please check the file format and ensure it has a SKU column.',
          status: 'ERROR',
          icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
        })
        return
      }

      setQuickOrderProducts([])
      setIsQuickOrderDrawerOpen(false)
      setNoProductsError(false)
      setSkusToFetch(skus)
    }

    const { products: fetchedProducts, isLoading: isLoadingProducts } =
      useBulkProductsQuery(skusToFetch)

    useEffect(() => {
      if (skusToFetch.length > 0 && isLoadingProducts) {
        setQuickOrderProducts([])
        setIsQuickOrderDrawerOpen(false)
        setNoProductsError(false)
        return
      }

      if (
        !isLoadingProducts &&
        skusToFetch.length > 0 &&
        csvData &&
        fetchedProducts.length > 0
      ) {
        const convertedProducts: Product[] = []

        fetchedProducts.forEach((productData) => {
          if (productData.product && !productData.error) {
            const csvItem = csvData.data.find(
              (item: { SKU: string; Quantity: number }) =>
                item.SKU === productData.sku ||
                item.SKU?.trim() === productData.sku?.trim()
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
        if (convertedProducts.length > 0) {
          setIsQuickOrderDrawerOpen(true)
          setFileUploadVisible(false)
          setNoProductsError(false)
        } else {
          setQuickOrderProducts([])
          setIsQuickOrderDrawerOpen(false)
          setNoProductsError(true)
          setFileUploadVisible(true)
        }
      } else if (
        !isLoadingProducts &&
        skusToFetch.length > 0 &&
        csvData &&
        fetchedProducts.length === 0
      ) {
        setQuickOrderProducts([])
        setIsQuickOrderDrawerOpen(false)
        setNoProductsError(true)
        setFileUploadVisible(true)
      }
    }, [fetchedProducts, skusToFetch, csvData, isLoadingProducts])

    useOnClickOutside(searchRef, () => {
      setSearchDropdownVisible(customSearchDropdownVisibleCondition ?? false)
      setFileUploadVisible(false)
      setIsUploadModalOpen(false)
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
              showAttachmentButton={true}
              attachmentButtonIcon={true}
              attachmentButtonProps={{
                onClick: () => setFileUploadVisible(true),
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
                hasError={(!!csvError || noProductsError) && !isLoadingProducts}
                {...((csvError || (noProductsError && !isLoadingProducts)) && {
                  errorType: noProductsError
                    ? 'no-products-found'
                    : mapCSVErrorToFileUploadErrorType(csvError.type),
                  errorMessage: noProductsError ? undefined : csvError?.message,
                })}
              />
            )}

            {isUploadModalOpen && (
              <Suspense fallback={null}>
                <UploadFileDropdown />
              </Suspense>
            )}
          </UISearchInput>
        )}
        <QuickOrderDrawer
          isOpen={isQuickOrderDrawerOpen}
          overlayProps={{
            onClick: () => {
              setIsQuickOrderDrawerOpen(false)
              setQuickOrderProducts([])
              setSkusToFetch([])
            },
          }}
          providerProps={{
            initialProducts: quickOrderProducts,
            onAddToCart: (
              productsToAdd: Product[],
              totalPrice: number,
              itemsCount: number
            ) => {
              productsToAdd.forEach((product: Product) => {
                if (
                  product.selectedCount > 0 &&
                  product.availability === 'available'
                ) {
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
            title={
              selectedFile ? formatFileName(selectedFile.name) : 'Quick Order'
            }
            onCloseDrawer={() => {
              setIsQuickOrderDrawerOpen(false)
              setQuickOrderProducts([])
              setSkusToFetch([])
            }}
          />
          <QuickOrderDrawerProducts
            columns={{
              name: 'Product Name',
              availability: {
                label: 'Availability',
                stockDisplaySettings: 'showAvailability',
              },
              price: 'Price (tax included)',
              quantity: 'Quantity',
            }}
            formatter={(price, variant) => priceFormatter(price)}
          />
          <QuickOrderDrawerFooter
            formatter={(price, variant) => priceFormatter(price)}
          />
        </QuickOrderDrawer>
      </>
    )
  }
)

export default SearchInput
