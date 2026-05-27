import { Button, Icon } from '@faststore/ui'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useSession } from 'src/sdk/session'

export type ProfileSummaryProps = {
  onLogoutClick?: (storeConfig: unknown) => void
  orgName: string
  bordered?: boolean
  showManageLink?: boolean
  person: {
    image?: ReactNode
    name: string
    email?: string
  }
}

export const ProfileSummary = ({
  onLogoutClick,
  person: { image, name, email },
  orgName,
  bordered = false,
  showManageLink = false,
  ...otherProps
}: ProfileSummaryProps) => {
  const { b2b } = useSession()

  return (
    <section
      data-fs-profile-summary
      data-fs-profile-summary-bordered={bordered}
      {...otherProps}
    >
      <div data-fs-profile-summary-header>
        <h2 data-fs-profile-summary-org-name>{orgName}</h2>
        {showManageLink && (
          <Link
            data-fs-profile-summary-org-link
            href={`/pvt/organization-account/org-unit/${b2b?.unitId}`}
          >
            Manage <Icon name="OpenInNew" width={23} height={23} />
          </Link>
        )}
      </div>
      <div data-fs-profile-summary-person-actions>
        <div data-fs-profile-summary-person-info>
          <div data-fs-profile-summary-person-image>
            {image ?? <Icon name="Profile" width={14} height={14} />}
          </div>
          <div data-fs-profile-summary-person-data>
            <p data-fs-profile-summary-person-name>{name}</p>
            {email && <p data-fs-profile-summary-person-email>{email}</p>}
          </div>
        </div>
        <Button
          data-fs-profile-summary-logout-button
          onClick={onLogoutClick}
          variant="tertiary"
          size="small"
        >
          Logout
        </Button>
      </div>
    </section>
  )
}
