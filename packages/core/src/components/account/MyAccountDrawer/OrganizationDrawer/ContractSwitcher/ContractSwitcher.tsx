import { Button, Icon, IconButton, Loader } from '@faststore/ui'
import { useState } from 'react'

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
    selectedId !== null && selectedId !== currentContract?.id && !switching

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
        {loading ? (
          <div data-fs-contract-switcher-loading aria-busy="true">
            <Loader />
          </div>
        ) : error ? (
          <div data-fs-contract-switcher-message role="alert">
            <p>We couldn't load your contracts. Please try again.</p>
          </div>
        ) : (
          <>
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

            {alternatives.length === 0 ? (
              <div
                data-fs-contract-switcher-message
                data-fs-contract-switcher-empty
              >
                <p>No other contracts are available for your organization.</p>
              </div>
            ) : (
              <>
                <p data-fs-contract-switcher-count>
                  Select one of <strong>{alternatives.length}</strong> available
                  contracts:
                </p>

                <div data-fs-contract-switcher-search>
                  <Icon name="MagnifyingGlass" width={20} height={20} />
                  <input
                    type="text"
                    value={search}
                    placeholder="Search"
                    aria-label="Search contracts"
                    onChange={(event) => setSearch(event.target.value)}
                  />
                  {search && (
                    <button
                      type="button"
                      data-fs-contract-switcher-search-clear
                      aria-label="Clear search"
                      onClick={() => setSearch('')}
                    >
                      <Icon name="X" width={18} height={18} />
                    </button>
                  )}
                </div>

                {ordered.length === 0 ? (
                  <div data-fs-contract-switcher-message>
                    <p>No contracts match your search.</p>
                  </div>
                ) : (
                  <ul data-fs-contract-switcher-list>
                    {ordered.map((contract) => {
                      const isSelected = selectedId === contract.id

                      return (
                        <li key={contract.id} data-fs-contract-switcher-item>
                          <button
                            type="button"
                            data-fs-contract-switcher-option
                            data-fs-contract-switcher-option-selected={
                              isSelected
                            }
                            aria-pressed={isSelected}
                            disabled={switching}
                            onClick={() => setSelectedId(contract.id)}
                          >
                            <span
                              data-fs-contract-switcher-avatar
                              aria-hidden="true"
                            >
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
                )}
              </>
            )}

            {switchError && (
              <div data-fs-contract-switcher-message role="alert">
                <p>
                  We couldn't switch your contract. The previous contract is
                  still active.
                </p>
              </div>
            )}
          </>
        )}
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
