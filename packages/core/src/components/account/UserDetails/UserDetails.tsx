import { useState } from 'react'

import { useSession } from 'src/sdk/session'
import Tag from '../components/Tag'
import AccountTable from '../components/Table'
import AccountHeader from '../components/Header'
import DelegationTab from './delegation/DelegationTab'
import {
  type DelegationLabels,
  resolveDelegationLabels,
} from './delegation/delegationLabels'
import {
  type UserDetailsSectionLabels,
  resolveUserDetailsLabels,
} from './userDetailsLabels'
import styles from './styles.module.scss'

type UserDetailsTab = 'details' | 'delegation'

type UserDetailsProps = {
  userDetails: {
    username: string
    name: string
    email: string
    phone: string
    role: string[]
    orgUnit: string
  }
  labels?: UserDetailsSectionLabels
  delegationLabels?: DelegationLabels
}

export default function UserDetails({
  userDetails: { username, name, email, phone, role, orgUnit },
  labels: labelsProp,
  delegationLabels: delegationLabelsProp,
}: UserDetailsProps) {
  const labels = resolveUserDetailsLabels(labelsProp)
  const delegationLabels = resolveDelegationLabels(delegationLabelsProp)
  const { b2b } = useSession()
  const [activeTab, setActiveTab] = useState<UserDetailsTab>('details')

  // Delegations belong to the B2B organization model: only members see the tab.
  const hasDelegation = Boolean(b2b?.unitId)
  const currentTab = hasDelegation ? activeTab : 'details'

  return (
    <section className={styles.section}>
      <AccountHeader pageTitle={labels.pageTitle} />
      {hasDelegation && (
        <div data-fs-user-details-tabs role="tablist">
          {(['details', 'delegation'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              data-fs-user-details-tab
              aria-selected={currentTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'details'
                ? delegationLabels.detailsTabLabel
                : delegationLabels.delegationTabLabel}
            </button>
          ))}
        </div>
      )}
      {currentTab === 'delegation' && (
        <DelegationTab
          userName={name.trim() || username || email}
          labels={delegationLabelsProp}
        />
      )}
      <div data-fs-user-details-container hidden={currentTab !== 'details'}>
        <AccountTable
          rows={[
            { heading: labels.nameLabel, data: name ? name : '–' },
            { heading: labels.usernameLabel, data: username ? username : '–' },
            { heading: labels.phoneLabel, data: phone ? phone : '–' },
            { heading: labels.emailLabel, data: email },
            {
              heading: labels.roleLabel,
              data: (
                <span data-fs-user-details-row-tags>
                  {role.map((r) => (
                    <Tag key={r}>{r}</Tag>
                  ))}
                </span>
              ),
            },
            { heading: labels.orgUnitLabel, data: orgUnit },
          ]}
        />
      </div>
    </section>
  )
}
