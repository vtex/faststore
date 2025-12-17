import type { CSSProperties, SetStateAction } from 'react'
import {
  Suspense,
  forwardRef,
  lazy,
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
  QuickOrderDrawer,
  QuickOrderDrawerFooter,
  QuickOrderDrawerHeader,
  QuickOrderDrawerProducts,
  Icon as UIIcon,
  IconButton as UIIconButton,
  SearchInput as UISearchInput,
  useCSVParser,
  useOnClickOutside,
  type CSVData,
  type Product,
} from '@faststore/ui'

import type {
  FileUploadCardProps,
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'

import type { SearchProviderContextValue } from '@faststore/ui'

import type { NavbarProps } from 'src/components/sections/Navbar'
import { usePage } from 'src/sdk/overrides/PageProvider'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSuggestions from 'src/sdk/search/useSuggestions'

import { DEFAULT_FILE_UPLOAD_CARD_PROPS } from 'src/components/search/fileUploadCardDefaults'
import type { UploadFileDropdownLabels } from 'src/components/search/UploadFileDropdown'
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

const UploadFileDropdown = dynamic(
  () =>
    import(
      /* webpackChunkName: "UploadFileDropdown" */
      'src/components/search/UploadFileDropdown'
    ).then((mod) => mod.default),
  { ssr: false }
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
  /** When true, shows the attachment button; can be set from CMS. */
  showAttachmentButton?: boolean
  /** Icon for the attachment button; can be set from CMS. */
  attachmentButtonIcon?: {
    icon: string
    alt: string
  }
  /** Aria-label for the attachment button; can be set from CMS. */
  attachmentButtonAriaLabel?: string
  /**
   * Called when the user clicks Search in the file upload card, with the parsed CSV data.
   * Use this to run bulk search, add to cart, or analytics.
   */
  onFileSearch?: (data: CSVData) => void
  /**
   * Props for FileUploadCard (labels, messages, etc.). Pass from CMS so all copy is editable.
   */
  fileUploadCardProps?: {
    title?: string
    fileInputAriaLabel?: string
    dropzoneAriaLabel?: string
    dropzoneTitle?: string
    selectFileButtonLabel?: string
    downloadTemplateButtonLabel?: string
    removeButtonAriaLabel?: string
    searchButtonLabel?: string
    uploadingStatusText?: string
    getCompletedStatusText?: (fileSize: number) => string
    errorMessages?: Partial<
      Record<string, { title: string; description: string }>
    >
  }
  /**
   * Labels / copy for the UploadFileDropdown (bulk upload modal).
   * Pass from CMS so all copy is editable.
   */
  uploadFileDropdownLabels?: UploadFileDropdownLabels
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
      onFileSearch,
      fileUploadCardProps,
      uploadFileDropdownLabels,
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
    const priceFormatter = usePriceFormatter()

    const [csvData, setCsvData] = useState<CSVData | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [skusToFetch, setSkusToFetch] = useState<string[]>([])

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
    // Access globalSettings for fileUpload configuration (section and content-type)
    let fileUploadConfig
    try {
      const pageContext = usePage<{ globalSettings?: { fileUpload?: any } }>()
      fileUploadConfig = pageContext?.globalSettings?.fileUpload
    } catch {
      fileUploadConfig = undefined
    }

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
      setIsUploadOpen(true)

      const file = files[0]
      setSelectedFile(file)

      onClearError()
      setCsvData(null)
      setQuickOrderProducts([])
      setSkusToFetch([])
      setIsQuickOrderDrawerOpen(false)

      try {
        const result = await onParseFile(file)

        if (result && result.data && result.data.length > 0) {
          setCsvData(result)
        }
      } catch {
        // Error will be handled by the CSV parser hook
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
        // Error handled silently
      }
    }

    const handleDismiss = () => {
      setCsvData(null)
      setSelectedFile(null)
      setSkusToFetch([])
      setQuickOrderProducts([])
      setFileUploadVisible(false)
      setIsUploadModalOpen(false)
      setHasFile(false)
      setIsUploadOpen(false)
      onClearError()
    }

    const handleSearch = async (_file?: File) => {
      let dataToUse = csvData

      if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
        const fileToParse = _file || selectedFile

        if (fileToParse) {
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
              return
            }
          } catch {
            return
          }
        } else {
          return
        }
      }

      if (!dataToUse || !dataToUse.data || dataToUse.data.length === 0) {
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

      const skus = dataToUse.data.map((item) => item.sku).filter(Boolean)

      if (skus.length > 0) {
        setQuickOrderProducts([])
        setIsQuickOrderDrawerOpen(false)
        setSkusToFetch(skus)
      }
    }

    const { products: fetchedProducts, isLoading: isLoadingProducts } =
      useBulkProductsQuery(skusToFetch)

    useEffect(() => {
      if (skusToFetch.length > 0 && isLoadingProducts) {
        setQuickOrderProducts([])
        setIsQuickOrderDrawerOpen(false)
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
              (item) =>
                item.sku === productData.sku ||
                item.sku?.trim() === productData.sku?.trim()
            )
            const requestedQuantity = csvItem?.quantity ?? 1

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
        }
      } else if (
        !isLoadingProducts &&
        skusToFetch.length > 0 &&
        csvData &&
        fetchedProducts.length === 0
      ) {
        setQuickOrderProducts([])
        setIsQuickOrderDrawerOpen(false)
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
              showAttachmentButton={showAttachmentButton}
              attachmentButtonAriaLabel={
                attachmentButtonAriaLabel ??
                attachmentButtonIcon?.alt ??
                'Attach File'
              }
              attachmentButtonIcon={
                showAttachmentButton && attachmentButtonIcon ? (
                  <UIIcon
                    name={attachmentButtonIcon.icon}
                    aria-label={attachmentButtonIcon.alt}
                  />
                ) : undefined
              }
              attachmentButtonProps={{
                onClick: () => {
                  setFileUploadVisible(true)
                  setIsUploadModalOpen(true)
                },
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
                {...({
                  isOpen: isUploadOpen || hasFile || fileUploadVisible,
                  onDismiss: handleDismiss,
                  onFileSelect: handleFileSelect,
                  onDownloadTemplate: handleDownloadTemplate,
                  formatterFileSize: formatFileSize,
                  formatterFileName: formatFileName,
                  onSearch: handleSearch,
                  isUploading: isCsvProcessing || isLoadingProducts,
                  hasError: !!csvError,
                  accept: fileUploadConfig?.acceptedFileTypes ?? '.csv',
                  ...(fileUploadCardProps ?? DEFAULT_FILE_UPLOAD_CARD_PROPS),
                  ...(fileUploadConfig?.errorMessages && {
                    errorMessages: {
                      ...(fileUploadCardProps?.errorMessages ??
                        DEFAULT_FILE_UPLOAD_CARD_PROPS.errorMessages),
                      ...fileUploadConfig.errorMessages,
                    },
                  }),
                  ...(fileUploadConfig?.labels && {
                    selectFileButtonLabel:
                      fileUploadConfig.labels.selectFile ??
                      fileUploadCardProps?.selectFileButtonLabel,
                    downloadTemplateButtonLabel:
                      fileUploadConfig.labels.downloadTemplate ??
                      fileUploadCardProps?.downloadTemplateButtonLabel,
                    searchButtonLabel:
                      fileUploadConfig.labels.search ??
                      fileUploadCardProps?.searchButtonLabel,
                    removeButtonAriaLabel:
                      fileUploadConfig.labels.remove ??
                      fileUploadCardProps?.removeButtonAriaLabel,
                    uploadingStatusText:
                      fileUploadConfig.labels.uploading ??
                      fileUploadCardProps?.uploadingStatusText,
                    dropzoneTitle:
                      fileUploadConfig.labels.dropzone ??
                      fileUploadCardProps?.dropzoneTitle,
                  }),
                } as FileUploadCardProps)}
              />
            )}

            {isUploadModalOpen && (
              <Suspense fallback={null}>
                <UploadFileDropdown labels={uploadFileDropdownLabels} />
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
