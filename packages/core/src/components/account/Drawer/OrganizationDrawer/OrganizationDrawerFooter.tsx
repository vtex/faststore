import { Icon, IconButton, Link } from '@faststore/ui'

export interface OrganizationDrawerFooterProps {
  orgName: string
  userName: string
  userEmail?: string
  showManageLink?: boolean
  manageUrl?: string
  onLogoutClick?: () => void
}

export const OrganizationDrawerFooter = ({
  orgName,
  userName,
  userEmail,
  showManageLink,
  manageUrl,
  onLogoutClick,
}: OrganizationDrawerFooterProps) => {
  return (
    <div data-fs-organization-drawer-footer>
      <div data-fs-organization-drawer-footer-org>
        <div data-fs-organization-drawer-footer-org-info>
          <Icon
            data-fs-organization-drawer-footer-org-icon
            name="FolderOpen"
            width={18}
            height={18}
          />
          <span data-fs-organization-drawer-footer-org-name>{orgName}</span>
        </div>
        {showManageLink && manageUrl && (
          <Link href={manageUrl} data-fs-organization-drawer-footer-manage>
            Manage
          </Link>
        )}
      </div>

      <div data-fs-organization-drawer-footer-user>
        <div data-fs-organization-drawer-footer-user-info>
          <p data-fs-organization-drawer-footer-user-name>{userName}</p>
          {userEmail && (
            <p data-fs-organization-drawer-footer-user-email>{userEmail}</p>
          )}
        </div>
        <IconButton
          data-fs-organization-drawer-footer-logout
          aria-label="Log out"
          icon={<Icon name="SignOut" width={20} height={20} />}
          onClick={onLogoutClick}
        />
      </div>
    </div>
  )
}
