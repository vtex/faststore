import { Link, SlideOverHeader } from '@faststore/ui'
import type { ReactNode } from 'react'

export type OrganizationDrawerHeaderProps = {
  onCloseDrawer?: () => void
  // onSwitchButtonClick?: () => void
  contractImage?: ReactNode
  contractName: string
  contractUrl: string
}

export const OrganizationDrawerHeader = ({
  contractUrl,
  contractName,
  contractImage,
  onCloseDrawer,
  // onSwitchButtonClick,
}: OrganizationDrawerHeaderProps) => {
  return (
    <>
      {/* biome-ignore lint/correctness/noChildrenProp: <explanation> */}
      <SlideOverHeader onClose={() => onCloseDrawer?.()} children={null} />
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
        {/* // Switch contract is not available for now */}
        {/* <Button
          data-fs-organization-drawer-header-switch-button
          iconPosition="left"
          onClick={() => onSwitchButtonClick?.()}
          variant="tertiary"
          size="small"
        >
          Switch
        </Button> */}
      </div>
    </>
  )
}
