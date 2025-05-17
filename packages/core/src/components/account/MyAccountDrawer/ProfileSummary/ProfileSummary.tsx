import { Button } from '@faststore/ui'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useSession } from 'src/sdk/session'
import { Icon } from '../Icon'

export type ProfileSummaryProps = {
  onLogoutClick?: (storeConfig: unknown) => void
  orgName: string
  bordered?: boolean
  showManageLink?: boolean
  person: {
    image?: ReactNode
    name: string
    role?: string
  }
}

export const ProfileSummary = ({
  onLogoutClick,
  person: { image, name, role },
  orgName,
  bordered = false,
  showManageLink = false,
  ...otherProps
}: ProfileSummaryProps) => {
  const { b2b } = useSession()
  return (
    <section
      data-fs-self-profile-summary
      data-fs-self-profile-summary-bordered={bordered}
      {...otherProps}
    >
      <div data-fs-self-profile-summary-header>
        <h2 data-fs-self-profile-summary-org-name>{orgName}</h2>
        {showManageLink && (
          <Link
            data-fs-self-profile-summary-org-link
            href={
              b2b?.unitId
                ? `/buyer-portal/org-unit/${b2b?.unitId}`
                : '/buyer-portal'
            }
          >
            Manage <Icon name="OpenInNew" width={23} height={23} />
          </Link>
        )}
      </div>
      <div data-fs-self-profile-summary-person-actions>
        <div data-fs-self-profile-summary-person-image>
          {image ?? <Icon name="Profile" width={14} height={14} />}
        </div>
        <div data-fs-self-profile-summary-person-data>
          <p data-fs-self-profile-summary-person-name>{name}</p>
          {role && <p data-fs-self-profile-summary-person-role>{role}</p>}
        </div>
        <Button
          data-fs-self-profile-summary-logout-button
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
