import { Link, SlideOverHeader } from '@vtex/faststore-ui'
import type { ReactNode } from 'react'

export type OrganizationDrawerHeaderProps = {
  onCloseDrawer?: () => void
  contractImage?: ReactNode
  contractName: string
  contractUrl: string
}

export const OrganizationDrawerHeader = ({
  contractUrl,
  contractName,
  contractImage,
  onCloseDrawer,
}: OrganizationDrawerHeaderProps) => {
  return (
    <>
      <SlideOverHeader onClose={() => onCloseDrawer?.()} />
      <div data-fs-organization-drawer-header>
        <Link
          data-fs-organization-drawer-header-contract-link
          href={contractUrl}
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
      </div>
    </>
  )
}
