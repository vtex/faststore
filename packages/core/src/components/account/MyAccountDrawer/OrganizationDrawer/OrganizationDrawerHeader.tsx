import { Button, Link, SlideOverHeader } from '@faststore/ui'
import type { ReactNode } from 'react'

export type OrganizationDrawerHeaderProps = {
  onCloseDrawer?: () => void
  contractImage?: ReactNode
  contractName: string
  contractUrl: string
  /**
   * When provided, renders the "Change" CTA next to the active contract,
   * opening the contract switcher (Figma node 103-5434).
   */
  onChangeContract?: () => void
}

export const OrganizationDrawerHeader = ({
  contractUrl,
  contractName,
  contractImage,
  onCloseDrawer,
  onChangeContract,
}: OrganizationDrawerHeaderProps) => {
  return (
    <>
      <SlideOverHeader onClose={() => onCloseDrawer?.()} />
      <div data-fs-organization-drawer-header>
        <Link
          data-fs-organization-drawer-header-contract-link
          {...(contractUrl && { href: contractUrl })}
        >
          <div data-fs-organization-drawer-header-contract-image>
            {contractImage ?? (
              <span data-fs-organization-drawer-header-contract-image-fallback>
                {contractName?.at(0)?.toUpperCase() ?? ''}
              </span>
            )}
          </div>
          <h1 data-fs-organization-drawer-header-contract-name>
            {contractName}
          </h1>
        </Link>
        {onChangeContract && (
          <Button
            data-fs-organization-drawer-header-change
            variant="secondary"
            onClick={onChangeContract}
          >
            Change
          </Button>
        )}
      </div>
    </>
  )
}
