import type { CSSProperties, SetStateAction } from 'react'
import {
  Suspense,
  forwardRef,
  lazy,
  useDeferredValue,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

import type { SearchEvent, SearchState } from '@faststore/sdk'

import {
  FileUploadCard,
  Icon as UIIcon,
  IconButton as UIIconButton,
  SearchInput as UISearchInput,
  useOnClickOutside,
} from '@faststore/ui'

import type {
  FileUploadCardProps,
  SearchInputFieldProps as UISearchInputFieldProps,
  SearchInputFieldRef as UISearchInputFieldRef,
} from '@faststore/ui'

import type { SearchProviderContextValue } from '@faststore/ui'

import type { NavbarProps } from 'src/components/sections/Navbar'
import useSearchHistory from 'src/sdk/search/useSearchHistory'
import useSuggestions from 'src/sdk/search/useSuggestions'

import { formatSearchPath } from 'src/sdk/search/formatSearchPath'

const SearchDropdown = lazy(
  /* webpackChunkName: "SearchDropdown" */
  () => import('src/components/search/SearchDropdown')
)

const UISearchInputField = dynamic<UISearchInputFieldProps & any>(() =>
  /* webpackChunkName: "UISearchInputField" */
  import('@faststore/ui').then((module) => module.SearchInputField)
)

const UploadFileDropdown = dynamic(
  () =>
    import(
      /* webpackChunkName: "UploadFileDropdown" */
      'src/components/search/UploadFileDropdown/UploadFileDropdown'
    ).then((mod) => mod.default),
  { ssr: false }
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
  /** Aria-label for the attachment button; can be set from CMS. */
  attachmentButtonAriaLabel?: string
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
      showAttachmentButton = true,
      attachmentButtonAriaLabel,
      fileUploadCardProps,
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

    const searchRef = useRef<HTMLDivElement>(null)
    const { addToSearchHistory } = useSearchHistory()
    const router = useRouter()

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
      setHasFile(true)
      setIsUploadOpen(true)
      // TODO: Handle file upload logic
      // setFileUploadVisible(false)
    }

    const handleDownloadTemplate = () => {
      // Create a sample CSV template
      const csvContent = 'Product ID,Quantity,Price\n001,10,99.99\n002,5,49.99'
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'template.csv'
      a.click()
      window.URL.revokeObjectURL(url)
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
              buttonProps={buttonProps}
              placeholder={placeholder}
              showAttachmentButton={showAttachmentButton}
              attachmentButtonAriaLabel={attachmentButtonAriaLabel}
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
                {...({
                  isOpen: isUploadOpen || hasFile || fileUploadVisible,
                  onDismiss: () => setFileUploadVisible(false),
                  onFileSelect: handleFileSelect,
                  onDownloadTemplate: handleDownloadTemplate,
                  ...(fileUploadCardProps ?? {}),
                } as FileUploadCardProps)}
              />
            )}

            {isUploadModalOpen && (
              <Suspense fallback={null}>
                <UploadFileDropdown />
              </Suspense>
            )}
          </UISearchInput>
        )}
      </>
    )
  }
)

export default SearchInput
