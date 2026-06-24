import { Button, Icon, IconButton, Loader } from '@faststore/ui'
import { useState, type ReactNode } from 'react'

import { useAvailableContracts } from 'src/sdk/account/useAvailableContracts'
import { useSwitchContract } from 'src/sdk/account/useSwitchContract'

export type ContractSwitcherProps = {
  /** Returns to the drawer menu view (also used by Cancel). */
  onBack: () => void
  /** Closes the whole drawer. */
  onClose: () => void
  /** Called after a contract switch succeeds. */
  onSwitched?: () => void
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
  loading: boolean
  error: Error | null
  currentContract: SwitcherContract | null
  alternatives: SwitcherContract[]
  ordered: SwitcherContract[]
  search: string
  selectedId: string | null
  switching: boolean
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

const ContractSwitcherLoadError = () => (
  <div data-fs-contract-switcher-message role="alert">
    <p>We couldn't load your contracts. Please try again.</p>
  </div>
)

const ContractSwitcherCurrentSession = ({
  currentContract,
}: {
  currentContract: SwitcherContract | null
}) => (
  <div data-fs-contract-switcher-current>
    <span data-fs-contract-switcher-label>Current session</span>
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

const ContractSwitcherEmptyAlternatives = () => (
  <div data-fs-contract-switcher-message data-fs-contract-switcher-empty>
    <p>No other contracts are available for your organization.</p>
  </div>
)

type ContractSwitcherAlternativesProps = {
  alternatives: SwitcherContract[]
  ordered: SwitcherContract[]
  search: string
  selectedId: string | null
  switching: boolean
  onSearchChange: (value: string) => void
  onSearchClear: () => void
  onSelectContract: (contractId: string) => void
}

const ContractSwitcherSearch = ({
  search,
  onSearchChange,
  onSearchClear,
}: Pick<
  ContractSwitcherAlternativesProps,
  'search' | 'onSearchChange' | 'onSearchClear'
>) => (
  <div data-fs-contract-switcher-search>
    <Icon name="MagnifyingGlass" width={20} height={20} />
    <input
      type="text"
      value={search}
      placeholder="Search"
      aria-label="Search contracts"
      onChange={(event) => onSearchChange(event.target.value)}
    />
    {search && (
      <button
        type="button"
        data-fs-contract-switcher-search-clear
        aria-label="Clear search"
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
  switching,
  onSelectContract,
}: Pick<
  ContractSwitcherAlternativesProps,
  'ordered' | 'selectedId' | 'switching' | 'onSelectContract'
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
            disabled={switching}
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
  alternatives,
  ordered,
  search,
  selectedId,
  switching,
  onSearchChange,
  onSearchClear,
  onSelectContract,
}: ContractSwitcherAlternativesProps) => {
  if (alternatives.length === 0) {
    return <ContractSwitcherEmptyAlternatives />
  }

  let listContent: ReactNode
  if (ordered.length === 0) {
    listContent = (
      <div data-fs-contract-switcher-message>
        <p>No contracts match your search.</p>
      </div>
    )
  } else {
    listContent = (
      <ContractSwitcherOptionList
        ordered={ordered}
        selectedId={selectedId}
        switching={switching}
        onSelectContract={onSelectContract}
      />
    )
  }

  return (
    <>
      <p data-fs-contract-switcher-count>
        Select one of <strong>{alternatives.length}</strong> available
        contracts:
      </p>
      <ContractSwitcherSearch
        search={search}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
      />
      {listContent}
    </>
  )
}

const ContractSwitcherSwitchError = () => (
  <div data-fs-contract-switcher-message role="alert">
    <p>
      We couldn't switch your contract. The previous contract is still active.
    </p>
  </div>
)

const ContractSwitcherContent = ({
  loading,
  error,
  currentContract,
  alternatives,
  ordered,
  search,
  selectedId,
  switching,
  switchError,
  onSearchChange,
  onSearchClear,
  onSelectContract,
}: ContractSwitcherContentProps) => {
  if (loading) {
    return <ContractSwitcherLoading />
  }

  if (error) {
    return <ContractSwitcherLoadError />
  }

  return (
    <>
      <ContractSwitcherCurrentSession currentContract={currentContract} />
      <ContractSwitcherAlternatives
        alternatives={alternatives}
        ordered={ordered}
        search={search}
        selectedId={selectedId}
        switching={switching}
        onSearchChange={onSearchChange}
        onSearchClear={onSearchClear}
        onSelectContract={onSelectContract}
      />
      {switchError && <ContractSwitcherSwitchError />}
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
  onSwitched,
}: ContractSwitcherProps) => {
  const { contracts, loading, error } = useAvailableContracts(true)
  const {
    switchContract,
    loading: switching,
    error: switchError,
    enabled: switchEnabled,
  } = useSwitchContract()

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const allContracts: SwitcherContract[] = contracts
  const currentContract =
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
    !switching

  const handleConfirm = async () => {
    if (!selectedId) {
      return
    }

    const ok = await switchContract(selectedId)

    if (ok) {
      onSwitched?.()
    }
  }

  return (
    <section data-fs-contract-switcher>
      <header data-fs-contract-switcher-header>
        <IconButton
          data-fs-contract-switcher-back
          aria-label="Back to account menu"
          icon={<Icon name="ArrowLeft" width={20} height={20} />}
          onClick={onBack}
        />
        <h2 data-fs-contract-switcher-title>Change contract</h2>
        <IconButton
          data-fs-contract-switcher-close
          aria-label="Close"
          icon={<Icon name="X" width={20} height={20} />}
          onClick={onClose}
        />
      </header>

      <div data-fs-contract-switcher-content>
        <ContractSwitcherContent
          loading={loading}
          error={error}
          currentContract={currentContract}
          alternatives={alternatives}
          ordered={ordered}
          search={search}
          selectedId={selectedId}
          switching={switching}
          switchError={switchError}
          onSearchChange={setSearch}
          onSearchClear={() => setSearch('')}
          onSelectContract={setSelectedId}
        />
      </div>

      <footer data-fs-contract-switcher-footer>
        <Button variant="tertiary" onClick={onBack}>
          Cancel
        </Button>
        <Button
          variant="primary"
          disabled={!canConfirm}
          loading={switching}
          loadingLabel="Switching"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </footer>
    </section>
  )
}
