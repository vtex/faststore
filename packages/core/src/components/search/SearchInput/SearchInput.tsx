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
  SearchInputField,
  Icon as UIIcon,
  IconButton as UIIconButton,
  SearchInput as UISearchInput,
  useCSVParser,
  useOnClickOutside,
  type CSVData,
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
import { formatFileName, formatFileSize } from 'src/utils/utilities'

const SearchDropdown = lazy(
  /* webpackChunkName: "SearchDropdown" */
  () => import('src/components/search/SearchDropdown')
)

// const UISearchInputField = dynamic<UISearchInputFieldProps & any>(() =>
//   /* webpackChunkName: "UISearchInputField" */
//   import('@faststore/ui').then((module) => module.SearchInputField)
// )

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

    const [csvData, setCsvData] = useState<CSVData | null>(null)

    const {
      error: csvError,
      isProcessing: isCsvProcessing,
      onParseFile,
      onClearError,
      onKillWorkers,
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
      console.log('Performing bulk search with CSV data:', csvData)
    }

    useOnClickOutside(searchRef, () => {
      setSearchDropdownVisible(customSearchDropdownVisibleCondition ?? false)
      setFileUploadVisible(false)
    })

    useEffect(() => {
      return () => onKillWorkers()
    }, [onKillWorkers])

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
            <SearchInputField
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
                  onDismiss: handleDismiss,
                  onFileSelect: handleFileSelect,
                  onDownloadTemplate: handleDownloadTemplate,
                  formatterFileSize: formatFileSize,
                  formatterFileName: formatFileName,
                  onSearch: handleSearch,
                  isUploading: isCsvProcessing,
                  hasError: !!csvError,
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
