import { Button, Icon, IconButton, Loader } from '@faststore/ui'
import { useState, type ReactNode } from 'react'

import { useAccountNavigationLabels } from 'src/sdk/account/accountPageContext'
import { useAvailableContracts } from 'src/sdk/account/useAvailableContracts'
import { useSwitchContract } from 'src/sdk/account/useSwitchContract'
import { useSession } from 'src/sdk/session'

/** English fallbacks used when the CMS doesn't provide a `navigationLabels` override. */
const defaultContractSwitcherLabels = {
  titleLabel: 'Change contract',
  backLabel: 'Back to account menu',
  closeLabel: 'Close',
  currentSessionLabel: 'Current session',
  searchPlaceholder: 'Search',
  searchAriaLabel: 'Search contracts',
  clearSearchLabel: 'Clear search',
  availableCountLabel: 'Select one of {count} available contracts:',
  noMatchLabel: 'No contracts match your search.',
  emptyLabel: 'No other contracts are available for your organization.',
  loadErrorLabel: "We couldn't load your contracts. Please try again.",
  switchErrorLabel:
    "We couldn't switch your contract. The previous contract is still active.",
  cancelLabel: 'Cancel',
  confirmLabel: 'Confirm',
}

type ContractSwitcherLabels = typeof defaultContractSwitcherLabels

/**
 * Splits `availableCountLabel` on the `{count}` placeholder so the count can be
 * wrapped in a `<strong>`, keeping the CMS convention of plain string labels
 * (no templating engine) while still allowing surrounding text to be localized.
 */
const splitAvailableCountLabel = (template: string) => {
  const [prefix, suffix] = template.split('{count}')
  return { prefix: prefix ?? '', suffix: suffix ?? '' }
}

export type ContractSwitcherProps = {
  /** Returns to the drawer menu view (also used by Cancel). */
  onBack: () => void
  /** Closes the whole drawer. */
  onClose: () => void
}

/**
 * Contract that can be displayed by the switcher. `isDefault` is optional so the
 * component compiles against both the local mock and the real
 * `useAvailableContracts` hook (which does not expose a default yet).
 */
type SwitcherContract = {
  id: string
  corporateName: string
  isActive: boolean
  isDefault?: boolean
}

const initialOf = (name: string) => name.trim().charAt(0).toUpperCase()

type ContractSwitcherContentProps = {
  labels: ContractSwitcherLabels
  loading: boolean
  error: Error | null
  currentContract: SwitcherContract | null
  alternatives: SwitcherContract[]
  ordered: SwitcherContract[]
  search: string
  selectedId: string | null
  switchError: Error | null
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  onSelectContract: (contractId: string) => void
}

const ContractSwitcherLoading = () => (
  <div data-fs-contract-switcher-loading aria-busy="true">
    <Loader />
  </div>
)

const ContractSwitcherLoadError = ({
  labels,
}: {
  labels: ContractSwitcherLabels
}) => (
  <div data-fs-contract-switcher-message role="alert">
    <p>{labels.loadErrorLabel}</p>
  </div>
)

const ContractSwitcherCurrentSession = ({
  labels,
  currentContract,
}: {
  labels: ContractSwitcherLabels
  currentContract: SwitcherContract | null
}) => (
  <div data-fs-contract-switcher-current>
    <span data-fs-contract-switcher-label>{labels.currentSessionLabel}</span>
    {currentContract && (
      <div data-fs-contract-switcher-current-card>
        <span data-fs-contract-switcher-avatar aria-hidden="true">
          {initialOf(currentContract.corporateName)}
        </span>
        <span data-fs-contract-switcher-option-name>
          {currentContract.corporateName}
        </span>
        {currentContract.isDefault && (
          <Icon
            data-fs-contract-switcher-default
            name="Star"
            width={20}
            height={20}
          />
        )}
      </div>
    )}
  </div>
)

const ContractSwitcherEmptyAlternatives = ({
  labels,
}: {
  labels: ContractSwitcherLabels
}) => (
  <div data-fs-contract-switcher-message data-fs-contract-switcher-empty>
    <p>{labels.emptyLabel}</p>
  </div>
)

type ContractSwitcherAlternativesProps = {
  labels: ContractSwitcherLabels
  alternatives: SwitcherContract[]
  ordered: SwitcherContract[]
  search: string
  selectedId: string | null
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  onSelectContract: (contractId: string) => void
}

const ContractSwitcherSearch = ({
  labels,
  search,
  onSearchChange,
  onSearchClear,
}: Pick<
  ContractSwitcherAlternativesProps,
  'labels' | 'search' | 'onSearchChange' | 'onSearchClear'
>) => (
  <div data-fs-contract-switcher-search>
    <Icon name="MagnifyingGlass" width={20} height={20} />
    <input
      type="text"
      value={search}
      placeholder={labels.searchPlaceholder}
      aria-label={labels.searchAriaLabel}
      onChange={(event) => onSearchChange(event.target.value)}
    />
    {search && (
      <button
        type="button"
        data-fs-contract-switcher-search-clear
        aria-label={labels.clearSearchLabel}
        onClick={onSearchClear}
      >
        <Icon name="X" width={18} height={18} />
      </button>
    )}
  </div>
)

const ContractSwitcherOptionList = ({
  ordered,
  selectedId,
  onSelectContract,
}: Pick<
  ContractSwitcherAlternativesProps,
  'ordered' | 'selectedId' | 'onSelectContract'
>) => (
  <ul data-fs-contract-switcher-list>
    {ordered.map((contract) => {
      const isSelected = selectedId === contract.id

      return (
        <li key={contract.id} data-fs-contract-switcher-item>
          <button
            type="button"
            data-fs-contract-switcher-option
            data-fs-contract-switcher-option-selected={isSelected}
            aria-pressed={isSelected}
            onClick={() => onSelectContract(contract.id)}
          >
            <span data-fs-contract-switcher-avatar aria-hidden="true">
              {initialOf(contract.corporateName)}
            </span>
            <span data-fs-contract-switcher-option-name>
              {contract.corporateName}
            </span>
            {contract.isDefault && (
              <Icon
                data-fs-contract-switcher-default
                name="Star"
                width={20}
                height={20}
              />
            )}
          </button>
        </li>
      )
    })}
  </ul>
)

const ContractSwitcherAlternatives = ({
  labels,
  alternatives,
  ordered,
  search,
  selectedId,
  onSearchChange,
  onSearchClear,
  onSelectContract,
}: ContractSwitcherAlternativesProps) => {
  if (alternatives.length === 0) {
    return <ContractSwitcherEmptyAlternatives labels={labels} />
  }

  let listContent: ReactNode
  if (ordered.length === 0) {
    listContent = (
      <div data-fs-contract-switcher-message>
        <p>{labels.noMatchLabel}</p>
      </div>
    )
  } else {
    listContent = (
      <ContractSwitcherOptionList
        ordered={ordered}
        selectedId={selectedId}
        onSelectContract={onSelectContract}
      />
    )
  }

  const { prefix, suffix } = splitAvailableCountLabel(
    labels.availableCountLabel
  )

  return (
    <>
      <p data-fs-contract-switcher-count>
        {prefix}
        <strong>{alternatives.length}</strong>
        {suffix}
      </p>
      <ContractSwitcherSearch
        labels={labels}
        search={search}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
      />
      {listContent}
    </>
  )
}

const ContractSwitcherSwitchError = ({
  labels,
}: {
  labels: ContractSwitcherLabels
}) => (
  <div data-fs-contract-switcher-message role="alert">
    <p>{labels.switchErrorLabel}</p>
  </div>
)

const ContractSwitcherContent = ({
  labels,
  loading,
  error,
  currentContract,
  alternatives,
  ordered,
  search,
  selectedId,
  switchError,
  onSearchChange,
  onSearchClear,
  onSelectContract,
}: ContractSwitcherContentProps) => {
  if (loading) {
    return <ContractSwitcherLoading />
  }

  if (error) {
    return <ContractSwitcherLoadError labels={labels} />
  }

  return (
    <>
      <ContractSwitcherCurrentSession
        labels={labels}
        currentContract={currentContract}
      />
      <ContractSwitcherAlternatives
        labels={labels}
        alternatives={alternatives}
        ordered={ordered}
        search={search}
        selectedId={selectedId}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        onSelectContract={onSelectContract}
      />
      {switchError && <ContractSwitcherSwitchError labels={labels} />}
    </>
  )
}

/**
 * Sub-view of the OrganizationDrawer that lets a B2B buyer change the active
 * contract within their Organization Unit (REQ-03..06). Replaces the whole
 * drawer body while open: own header (back / title / close), the current
 * session, a searchable list of alternatives, and a Cancel / Confirm footer.
 */
export const ContractSwitcher = ({
  onBack,
  onClose,
}: ContractSwitcherProps) => {
  const navigationLabels = useAccountNavigationLabels()
  const labels: ContractSwitcherLabels = {
    titleLabel:
      navigationLabels?.contractSwitcherTitleLabel ??
      defaultContractSwitcherLabels.titleLabel,
    backLabel:
      navigationLabels?.contractSwitcherBackLabel ??
      defaultContractSwitcherLabels.backLabel,
    closeLabel:
      navigationLabels?.contractSwitcherCloseLabel ??
      defaultContractSwitcherLabels.closeLabel,
    currentSessionLabel:
      navigationLabels?.contractSwitcherCurrentSessionLabel ??
      defaultContractSwitcherLabels.currentSessionLabel,
    searchPlaceholder:
      navigationLabels?.contractSwitcherSearchPlaceholder ??
      defaultContractSwitcherLabels.searchPlaceholder,
    searchAriaLabel:
      navigationLabels?.contractSwitcherSearchAriaLabel ??
      defaultContractSwitcherLabels.searchAriaLabel,
    clearSearchLabel:
      navigationLabels?.contractSwitcherClearSearchLabel ??
      defaultContractSwitcherLabels.clearSearchLabel,
    availableCountLabel:
      navigationLabels?.contractSwitcherAvailableCountLabel ??
      defaultContractSwitcherLabels.availableCountLabel,
    noMatchLabel:
      navigationLabels?.contractSwitcherNoMatchLabel ??
      defaultContractSwitcherLabels.noMatchLabel,
    emptyLabel:
      navigationLabels?.contractSwitcherEmptyLabel ??
      defaultContractSwitcherLabels.emptyLabel,
    loadErrorLabel:
      navigationLabels?.contractSwitcherLoadErrorLabel ??
      defaultContractSwitcherLabels.loadErrorLabel,
    switchErrorLabel:
      navigationLabels?.contractSwitcherSwitchErrorLabel ??
      defaultContractSwitcherLabels.switchErrorLabel,
    cancelLabel:
      navigationLabels?.contractSwitcherCancelLabel ??
      defaultContractSwitcherLabels.cancelLabel,
    confirmLabel:
      navigationLabels?.contractSwitcherConfirmLabel ??
      defaultContractSwitcherLabels.confirmLabel,
  }

  const { contracts, loading, error } = useAvailableContracts(true)
  const { b2b } = useSession()
  const {
    switchContract,
    loading: switching,
    error: switchError,
    enabled: switchEnabled,
  } = useSwitchContract()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allContracts: SwitcherContract[] = contracts
  const activeContractId = b2b?.customerId?.trim() ?? ''
  const currentContract =
    (activeContractId
      ? allContracts.find((contract) => contract.id === activeContractId)
      : null) ??
    allContracts.find((contract) => contract.isActive) ??
    allContracts[0] ??
    null

  const alternatives = allContracts.filter(
    (contract) => contract.id !== currentContract?.id
  )

  const query = search.toLowerCase().trim()
  const filtered = query
    ? alternatives.filter((contract) =>
        contract.corporateName.toLowerCase().includes(query)
      )
    : alternatives

  const ordered = [...filtered].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1
    if (b.isDefault && !a.isDefault) return 1
    return a.corporateName.localeCompare(b.corporateName)
  })

  const canConfirm =
    switchEnabled &&
    selectedId !== null &&
    selectedId !== currentContract?.id &&
    ordered.some((contract) => contract.id === selectedId) &&
    !switching

  const handleConfirm = async () => {
    if (!selectedId) {
      return
    }

    await switchContract(selectedId)
  }

  return (
    <section data-fs-contract-switcher>
      <header data-fs-contract-switcher-header>
        <IconButton
          data-fs-contract-switcher-back
          aria-label={labels.backLabel}
          icon={<Icon name="ArrowLeft" width={20} height={20} />}
          onClick={onBack}
        />
        <h2 data-fs-contract-switcher-title>{labels.titleLabel}</h2>
        <IconButton
          data-fs-contract-switcher-close
          aria-label={labels.closeLabel}
          icon={<Icon name="X" width={20} height={20} />}
          onClick={onClose}
        />
      </header>

      <div data-fs-contract-switcher-content>
        <ContractSwitcherContent
          labels={labels}
          loading={loading}
          error={error}
          currentContract={currentContract}
          alternatives={alternatives}
          ordered={ordered}
          search={search}
          selectedId={selectedId}
          switchError={switchError}
          onSearchChange={setSearch}
          onSearchClear={() => setSearch('')}
          onSelectContract={setSelectedId}
        />
      </div>

      <footer data-fs-contract-switcher-footer>
        <Button variant="tertiary" onClick={onBack}>
          {labels.cancelLabel}
        </Button>
        <Button
          variant="primary"
          disabled={!canConfirm}
          loading={switching}
          onClick={handleConfirm}
        >
          {labels.confirmLabel}
        </Button>
      </footer>
    </section>
  )
}
