import { SlideOver, useFadeEffect } from '@faststore/ui'

import { useSession } from 'src/sdk/session'
import storeConfig from '../../../../../discovery.config'
import { ProfileSummary } from '../ProfileSummary/ProfileSummary'
import { OrganizationDrawerBody } from './OrganizationDrawerBody'
import { OrganizationDrawerHeader } from './OrganizationDrawerHeader'
import styles from './section.module.scss'

type OrganizationDrawerProps = {
  isOpen: boolean
  closeDrawer: () => void
  isRepresentative: boolean
}

export const doLogout = () => {
  if (!storeConfig) return
  window.location.assign(
    `${storeConfig.secureSubdomain}/api/vtexid/pub/logout?scope=${storeConfig.api.storeId}&returnUrl=${storeConfig.storeUrl}`
  )
}

export const OrganizationDrawer = ({
  isOpen,
  closeDrawer,
  isRepresentative,
}: OrganizationDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()
  const { b2b, person } = useSession()

  const contractName = person?.givenName ?? ''

  const contractUrl =
    b2b?.unitId && b2b?.permissions?.canManageOrganization
      ? `/pvt/organization-account/org-unit/${b2b?.unitId}`
      : null

  return (
    <SlideOver
      data-fs-organization-drawer
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && closeDrawer()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{
        className: `section ${styles.section} section-organization-drawer`,
      }}
    >
      <OrganizationDrawerHeader
        onCloseDrawer={closeDrawer}
        contractName={contractName}
        contractUrl={contractUrl}
      />
      <OrganizationDrawerBody isRepresentative={isRepresentative} />
      <footer data-fs-organization-drawer-footer-wrapper>
        <ProfileSummary
          showManageLink
          bordered={true}
          onLogoutClick={doLogout}
          person={{
            name: b2b?.userName ?? '',
            email: b2b?.userEmail ?? '',
          }}
          orgName={b2b?.unitName ?? ''}
        />
      </footer>
    </SlideOver>
  )
}
