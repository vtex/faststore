import type { CSSProperties, SetStateAction } from 'react'
import {
  Suspense,
  forwardRef,
  lazy,
  useCallback,
  useDeferredValue,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import type { SearchEvent, SearchState } from '@faststore/sdk'

import {
  FileUploadCard,
  FileUploadErrorType,
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
} from '@faststore/ui'

import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
  CSVData,
  Product,
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
  /**
   * Called when the user clicks Search in the file upload card, with the parsed CSV data.
   * Use this to run bulk search, add to cart, or analytics.
   */
  onFileSearch?: (data: CSVData) => void
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
      onFileSearch,
      ...otherProps
    },
    ref
  ) {
    const { hidden } = otherProps
    const [searchQuery, setSearchQuery] = useState<string>('')
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
    const [skuQuantityMap, setSkuQuantityMap] = useState<
      Record<string, number>
    >({})
    const [isLoadingWithDelay, setIsLoadingWithDelay] = useState(false)

    const csvParserOptions = useMemo(
      () => ({ delimiter: ',' as const, skipEmptyLines: true }),
      []
    )

    const csvParser = useCSVParser(csvParserOptions)
    const {
      error: csvError,
      isParsing: isCsvProcessing,
      onParseFile,
      onClearError,
      onGenerateTemplate,
    } = csvParser

    const isQuickOrderEnabled = quickOrderSettings?.quickOrder ?? false
    const attachmentButton = quickOrderSettings?.attachmentButton
    const toastMessages = quickOrderSettings?.toastMessages
    const drawerConfig = quickOrderSettings?.drawer
    const a11yLabels = quickOrderSettings?.accessibilityLabels
    const fileUploadCardConfig = quickOrderSettings?.fileUploadCard

    useImperativeHandle(ref, () => ({
      resetSearchInput: () => setSearchQuery(''),
    }))

    // Map CSV parser error types to FileUploadErrorType
    const mapCSVErrorToFileUploadErrorType = (
      csvErrorType?: string
    ): FileUploadErrorType => {
      if (csvErrorType === 'FILE_ERROR') {
        return FileUploadErrorType.Unreadable
      }
      return FileUploadErrorType.InvalidStructure
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
      setSkuQuantityMap({})
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
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          window.URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Failed to download template:', error)
      }
    }

    const handleDismiss = () => {
      setCsvData(null)
      setSelectedFile(null)
      setSkusToFetch([])
      setSkuQuantityMap({})
      setQuickOrderProducts([])
      setFileUploadVisible(false)
      setHasFile(false)
      setIsUploadOpen(false)
      setNoProductsError(false)
      onClearError()
    }

    const handleSearch = async (_file?: File) => {
      let dataToUse = csvData

      if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
        const fileToParse = _file || selectedFile

        if (!fileToParse) {
          pushToast({
            title: toastMessages?.noFileSelected?.title,
            message: toastMessages?.noFileSelected?.message,
            status: 'ERROR',
            icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
          })
          return
        }

        try {
          const parsePromise = onParseFile(fileToParse)

          const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => {
              reject(new Error(toastMessages?.fileTimeout?.message))
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
              title: toastMessages?.noDataFound?.title,
              message: toastMessages?.noDataFound?.message,
              status: 'ERROR',
              icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
            })
            return
          }
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : toastMessages?.fileProcessingError?.defaultMessage
          pushToast({
            title: toastMessages?.fileProcessingError?.title,
            message: errorMessage,
            status: 'ERROR',
            icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
          })
          return
        }
      }

      if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
        pushToast({
          title: toastMessages?.noDataAvailable?.title,
          message: toastMessages?.noDataAvailable?.message,
          status: 'ERROR',
          icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
        })
        return
      }

      const payload = {
        fileName: dataToUse.fileName,
        totalRows: dataToUse.totalRows,
        fileSize: dataToUse.fileSize,
        data: dataToUse.data,
      }
      try {
        window.dispatchEvent(
          new CustomEvent('faststore:file-search', { detail: payload })
        )
      } catch {
        // ignore in envs without window
      }
      onFileSearch?.(dataToUse)

      const map: Record<string, number> = {}
      for (const item of dataToUse.data) {
        const sku = item.sku?.trim()
        if (!sku) continue
        map[sku] = (map[sku] ?? 0) + (item.quantity ?? 1)
      }
      const uniqueSkus = Object.keys(map)

      if (uniqueSkus.length === 0) {
        pushToast({
          title: toastMessages?.noValidSkus?.title,
          message: toastMessages?.noValidSkus?.message,
          status: 'ERROR',
          icon: <UIIcon name="CircleWavyWarning" width={30} height={30} />,
        })
        return
      }

      setQuickOrderProducts([])
      setNoProductsError(false)
      setIsLoadingWithDelay(true)
      setSkuQuantityMap(map)
      // Open drawer immediately to show loading skeleton
      setIsQuickOrderDrawerOpen(true)
      setFileUploadVisible(false)
      setSkusToFetch(uniqueSkus)
    }

    const { products: fetchedProducts, isLoading: isLoadingProducts } =
      useBulkProductsQuery(skusToFetch)

    useEffect(() => {
      if (skusToFetch.length > 0 && isLoadingProducts) {
        // Clear products and show loading skeleton
        setQuickOrderProducts([])
        setIsLoadingWithDelay(true)
        // Keep drawer open to show loading skeleton
        setIsQuickOrderDrawerOpen(true)
        setFileUploadVisible(false)
        setNoProductsError(false)
        return
      }

      if (
        !isLoadingProducts &&
        skusToFetch.length > 0 &&
        Object.keys(skuQuantityMap).length > 0 &&
        fetchedProducts.length > 0
      ) {
        // Add artificial delay to test loading state
        setIsLoadingWithDelay(true)

        const timeoutId = setTimeout(() => {
          const convertedProducts: Product[] = []

          fetchedProducts.forEach((productData) => {
            if (productData.product && !productData.error) {
              const requestedQuantity =
                skuQuantityMap[productData.sku ?? ''] ?? 1

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
          setIsLoadingWithDelay(false)

          if (convertedProducts.length > 0) {
            setIsQuickOrderDrawerOpen(true)
            setFileUploadVisible(false)
            setNoProductsError(false)
          } else {
            // Keep drawer open to show empty state message
            setQuickOrderProducts([])
            setIsQuickOrderDrawerOpen(true)
            setFileUploadVisible(false)
            setNoProductsError(true)
          }
        }, 2000) // 2 second delay for testing

        return () => {
          clearTimeout(timeoutId)
        }
      }

      if (
        !isLoadingProducts &&
        skusToFetch.length > 0 &&
        Object.keys(skuQuantityMap).length > 0 &&
        fetchedProducts.length === 0
      ) {
        // Keep drawer open to show empty state message
        setQuickOrderProducts([])
        setIsQuickOrderDrawerOpen(true)
        setFileUploadVisible(false)
        setNoProductsError(true)
        setIsLoadingWithDelay(false)
      }
    }, [fetchedProducts, skusToFetch, skuQuantityMap, isLoadingProducts])

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

    const handleAddToCart = useCallback(
      (productsToAdd: Product[]) => {
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
                listPriceWithTaxes: offer.listPriceWithTaxes ?? product.price,
              })
            }
          }
        })

        setIsQuickOrderDrawerOpen(false)
      },
      [fetchedProducts]
    )

    const getCompletedStatusText = useCallback(
      (fileSize: number) => {
        const template = fileUploadCardConfig?.completedStatusTemplate ?? ''
        return template.replace('{fileSize}', (fileSize / 1024).toFixed(1))
      },
      [fileUploadCardConfig?.completedStatusTemplate]
    )

    const resolvedErrorMessages = useMemo(() => {
      const msgs = fileUploadCardConfig?.errorMessages ?? {}
      const result: Record<string, { title: string; description: string }> = {}

      for (const [key, val] of Object.entries(msgs)) {
        if (val?.title && val?.description) {
          result[key] = { title: val.title, description: val.description }
        }
      }

      return result
    }, [fileUploadCardConfig?.errorMessages])

    return (
      <>
        {hidden ? (
          <UIIconButton
            type="submit"
            aria-label={a11yLabels?.searchButtonAriaLabel}
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
              buttonProps={buttonProps}
              placeholder={placeholder}
              showAttachmentButton={isQuickOrderEnabled}
              attachmentButtonIcon={
                isQuickOrderEnabled && attachmentButton?.icon ? (
                  <UIIcon
                    name={attachmentButton.icon.icon}
                    aria-label={attachmentButton.icon.alt}
                  />
                ) : undefined
              }
              attachmentButtonAriaLabel={
                attachmentButton?.ariaLabel ?? a11yLabels?.attachButtonAriaLabel
              }
              attachmentButtonProps={{
                onClick: () => {
                  setFileUploadVisible(true)
                },
                'aria-label':
                  attachmentButton?.ariaLabel ??
                  a11yLabels?.attachButtonAriaLabel,
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
                title={fileUploadCardConfig?.title}
                fileInputAriaLabel={fileUploadCardConfig?.fileInputAriaLabel}
                dropzoneAriaLabel={fileUploadCardConfig?.dropzoneAriaLabel}
                dropzoneTitle={fileUploadCardConfig?.dropzoneTitle}
                selectFileButtonLabel={
                  fileUploadCardConfig?.selectFileButtonLabel
                }
                downloadTemplateButtonLabel={
                  fileUploadCardConfig?.downloadTemplateButtonLabel
                }
                removeButtonAriaLabel={
                  fileUploadCardConfig?.removeButtonAriaLabel
                }
                searchButtonLabel={fileUploadCardConfig?.searchButtonLabel}
                uploadingStatusText={fileUploadCardConfig?.uploadingStatusText}
                getCompletedStatusText={getCompletedStatusText}
                errorMessages={resolvedErrorMessages}
                accept={fileUploadCardConfig?.acceptedFileTypes}
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
                    ? FileUploadErrorType.NoProductsFound
                    : mapCSVErrorToFileUploadErrorType(csvError.type),
                  errorMessage: noProductsError ? undefined : csvError?.message,
                })}
              />
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
              setSkuQuantityMap({})
            },
          }}
          providerProps={{
            initialProducts: quickOrderProducts,
            isLoading: isLoadingProducts || isLoadingWithDelay,
            totalRequestedSkus: Object.keys(skuQuantityMap).length || 0,
            onAddToCart: handleAddToCart,
          }}
        >
          <QuickOrderDrawerHeader
            title={
              selectedFile
                ? formatFileName(selectedFile.name)
                : drawerConfig?.defaultTitle
            }
            onCloseDrawer={() => {
              setIsQuickOrderDrawerOpen(false)
              setQuickOrderProducts([])
              setSkusToFetch([])
              setSkuQuantityMap({})
            }}
          />
          <QuickOrderDrawerProducts
            columns={{
              name: drawerConfig?.columns?.name,
              availability: {
                label: drawerConfig?.columns?.availabilityLabel,
                stockDisplaySettings: 'showAvailability',
              },
              price: drawerConfig?.columns?.price,
              quantity: drawerConfig?.columns?.quantity,
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
