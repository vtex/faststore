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
  useOnClickOutside,
} from '@faststore/ui'

import type {
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
  Product,
} from '@faststore/ui'

import type { SearchProviderContextValue } from '@faststore/ui'

import type { NavbarProps } from 'src/components/sections/Navbar'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSuggestions from 'src/sdk/search/useSuggestions'

import { cartStore } from 'src/sdk/cart'
import type { CartItem } from 'src/sdk/cart'
import { usePriceFormatter } from 'src/sdk/product/useFormattedPrice'
import { useAuth } from 'src/sdk/auth'
import { useOrderEntry } from 'src/sdk/orderEntry/useOrderEntry'
import { useOrderFormItems } from 'src/sdk/orderEntry/useOrderFormItems'
import type { OrderFormCartItem } from 'src/sdk/orderEntry/useOrderFormItems'
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

function mapOrderFormItemsToProducts(items: OrderFormCartItem[]): Product[] {
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantityUpdated: false,
    image: { url: item.imageUrl ?? '', alternateName: item.name },
    inventory: item.availability === 'available' ? 9999 : 0,
    availability:
      item.availability === 'available' ? 'available' : 'outOfStock',
    selectedCount: item.quantity,
  }))
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
    const [oesOrderFormItems, setOesOrderFormItems] = useState<
      OrderFormCartItem[]
    >([])

    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()
    const priceFormatter = usePriceFormatter()

    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const {
      submitFile,
      status: oesStatus,
      isUploading: isOESUploading,
      isProcessing: isOESProcessing,
      error: oesError,
      reset: resetOES,
    } = useOrderEntry()

    const {
      fetchOrderFormItems,
      items: orderFormItems,
      reset: resetOrderFormItems,
    } = useOrderFormItems()

    useEffect(() => {
      if (
        (oesStatus?.status === 'SUCCESS' ||
          oesStatus?.status === 'PARTIAL_SUCCESS') &&
        oesStatus.entityId
      ) {
        fetchOrderFormItems(oesStatus.entityId)
      }
    }, [oesStatus?.status, oesStatus?.entityId])

    useEffect(() => {
      if (!orderFormItems || orderFormItems.length === 0) return
      setOesOrderFormItems(orderFormItems)
      setQuickOrderProducts(mapOrderFormItemsToProducts(orderFormItems))
      setFileUploadVisible(false)
      setIsUploadOpen(false)
      setIsQuickOrderDrawerOpen(true)
    }, [orderFormItems])

    const { isAutenticated } = useAuth()
    const isQuickOrderEnabled =
      (quickOrderSettings?.quickOrder ?? false) && isAutenticated
    const attachmentButton = quickOrderSettings?.attachmentButton
    const drawerConfig = quickOrderSettings?.drawer
    const a11yLabels = quickOrderSettings?.accessibilityLabels
    const fileUploadCardConfig = quickOrderSettings?.fileUploadCard

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

    const handleFileSelect = (files: File[]) => {
      if (files.length === 0) return
      setHasFile(true)
      setIsUploadOpen(true)
      setSelectedFile(files[0])
      resetOES()
    }

    const handleDownloadTemplate = () => {
      // template download is handled by the FileUploadCard's onDownloadTemplate prop
    }

    const handleDismiss = () => {
      setSelectedFile(null)
      setQuickOrderProducts([])
      setOesOrderFormItems([])
      setFileUploadVisible(false)
      setHasFile(false)
      setIsUploadOpen(false)
      resetOES()
      resetOrderFormItems()
    }

    const handleSearch = async (_file?: File) => {
      const file = _file ?? selectedFile
      if (!file) return
      await submitFile(file)
    }

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
    const searchId = data?.search.searchId

    const buttonProps = {
      onClick: onSearchClick,
      testId: buttonTestId,
    }

    const handleAddToCart = useCallback(
      (productsToAdd: Product[]) => {
        for (const product of productsToAdd) {
          if (
            product.selectedCount <= 0 ||
            product.availability !== 'available'
          )
            continue

          const originalItem = oesOrderFormItems.find(
            (item) => item.id === product.id
          )

          const cartItem: Omit<CartItem, 'id'> = {
            itemOffered: {
              sku: product.id,
              name: product.name,
              unitMultiplier: originalItem?.unitMultiplier ?? 1,
              image: [
                {
                  url: product.image.url,
                  alternateName: product.image.alternateName,
                },
              ],
              brand: { name: '' },
              isVariantOf: {
                productGroupID: '',
                name: product.name,
                skuVariants: {
                  activeVariations: {},
                  slugsMap: {},
                  availableVariations: {},
                },
              },
              gtin: '',
              additionalProperty: [],
            },
            seller: { identifier: originalItem?.seller ?? '1' },
            quantity: product.selectedCount,
            price: product.price,
            priceWithTaxes: product.price,
            listPrice: originalItem?.listPrice ?? product.price,
            listPriceWithTaxes: originalItem?.listPrice ?? product.price,
          }

          cartStore.addItem(cartItem)
        }
        setIsQuickOrderDrawerOpen(false)
        setQuickOrderProducts([])
        setOesOrderFormItems([])
      },
      [oesOrderFormItems]
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
            searchId={searchId}
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
                processingStatusText={
                  fileUploadCardConfig?.processingStatusText ?? 'Importing...'
                }
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
                isUploading={isOESUploading}
                isProcessing={isOESProcessing}
                hasError={!!oesError || oesStatus?.status === 'FAILED'}
                {...((oesError || oesStatus?.status === 'FAILED') && {
                  errorType: FileUploadErrorType.Unreadable,
                  errorMessage:
                    oesError?.message ?? oesStatus?.message ?? undefined,
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
              setOesOrderFormItems([])
            },
          }}
          providerProps={{
            initialProducts: quickOrderProducts,
            isLoading: false,
            totalRequestedSkus: 0,
            onAddToCart: handleAddToCart,
            alertMessages: drawerConfig?.alertMessages,
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
              setOesOrderFormItems([])
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
            formatter={(price) => priceFormatter(price)}
            messages={drawerConfig?.messages}
          />
          <QuickOrderDrawerFooter
            formatter={(price) => priceFormatter(price)}
            labels={drawerConfig?.footer}
          />
        </QuickOrderDrawer>
      </>
    )
  }
)

export default SearchInput
