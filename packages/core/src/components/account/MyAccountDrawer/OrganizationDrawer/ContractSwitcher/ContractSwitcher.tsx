import { Button, Icon, Loader } from '@faststore/ui'
import { useState } from 'react'

import { useAvailableContracts } from 'src/sdk/account/useAvailableContracts'
import { useSwitchContract } from 'src/sdk/account/useSwitchContract'

export type ContractSwitcherProps = {
  /** Returns to the drawer menu view. */
  onBack: () => void
  /** Called after a contract switch succeeds. */
  onSwitched?: () => void
}

/**
 * Sub-view of the OrganizationDrawer that lets a B2B buyer change the active
 * contract within their Organization Unit (REQ-03..06). Handles loading, empty
 * (single/no alternative), and error states.
 */
export const ContractSwitcher = ({
  onBack,
  onSwitched,
}: ContractSwitcherProps) => {
  const { contracts, loading, error } = useAvailableContracts(true)
  const {
    switchContract,
    loading: switching,
    error: switchError,
  } = useSwitchContract()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const hasAlternatives = contracts.length > 1

  const handleSelect = async (contractId: string, isActive: boolean) => {
    if (isActive || switching) {
      return
    }

    setPendingId(contractId)
    const ok = await switchContract(contractId)
    setPendingId(null)

    if (ok) {
      onSwitched?.()
    }
  }

  return (
    <section data-fs-contract-switcher>
      <header data-fs-contract-switcher-header>
        <Button
          data-fs-contract-switcher-back
          variant="tertiary"
          aria-label="Back to account menu"
          icon={<Icon name="ArrowLeft" width={20} height={20} />}
          iconPosition="left"
          onClick={onBack}
        >
          Switch contract
        </Button>
      </header>

      {loading && (
        <div data-fs-contract-switcher-loading aria-busy="true">
          <Loader />
        </div>
      )}

      {!loading && error && (
        <div data-fs-contract-switcher-message role="alert">
          <p>We couldn't load your contracts. Please try again.</p>
        </div>
      )}

      {!loading && !error && !hasAlternatives && (
        <div data-fs-contract-switcher-message data-fs-contract-switcher-empty>
          <p>No other contracts are available for your organization.</p>
        </div>
      )}

      {!loading && !error && hasAlternatives && (
        <ul data-fs-contract-switcher-list>
          {contracts.map((contract) => {
            const isPending = pendingId === contract.id

            return (
              <li key={contract.id} data-fs-contract-switcher-item>
                <button
                  type="button"
                  data-fs-contract-switcher-option
                  data-fs-contract-switcher-option-active={contract.isActive}
                  aria-current={contract.isActive ? 'true' : undefined}
                  aria-busy={isPending}
                  disabled={contract.isActive || switching}
                  onClick={() => handleSelect(contract.id, contract.isActive)}
                >
                  <span data-fs-contract-switcher-option-name>
                    {contract.corporateName}
                  </span>
                  {contract.isActive && (
                    <span data-fs-contract-switcher-option-active-label>
                      <Icon name="CheckCircle" width={18} height={18} />
                      Active
                    </span>
                  )}
                  {isPending && <Loader />}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {switchError && (
        <div data-fs-contract-switcher-message role="alert">
          <p>
            We couldn't switch your contract. The previous contract is still
            active.
          </p>
        </div>
      )}
    </section>
  )
}
