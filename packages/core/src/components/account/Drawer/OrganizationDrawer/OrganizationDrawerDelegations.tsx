import { Icon } from '@faststore/ui'
import { useState } from 'react'

import { SupervisorAccountIcon } from 'src/components/account/UserDetails/delegation/delegationIcons'
import { formatDelegationDate } from 'src/components/account/UserDetails/delegation/delegationUtils'
import { useDelegatedSession } from 'src/sdk/account/useDelegatedSession'
import { useDelegations } from 'src/sdk/account/useDelegations'
import { useSession } from 'src/sdk/session'

/** English labels. TODO: move to the CMS `navigationLabels` once the copy is defined. */
const labels = {
  impersonate: 'Impersonate',
  startError: "We couldn't start the session. Please try again.",
  count: (count: number) =>
    `${count} ${count === 1 ? 'delegation' : 'delegations'}`,
  countTooltip: (count: number) =>
    `You can act on behalf of ${count} users. Expand to choose one.`,
  rowTooltip: (start: string, end: string | null) =>
    end
      ? `You can act on behalf of this user from ${start} to ${end}.`
      : `You can act on behalf of this user from ${start} with no end date.`,
}

/**
 * Users the logged-in buyer (the Delegate) can act on behalf of: the same list
 * shown in My Account, "I can act on behalf of". It sits attached on top of the
 * user card, at the bottom of the drawer.
 *
 * - 0 delegations: nothing is rendered.
 * - 1 delegation: the user is shown directly, with the impersonate action.
 * - N delegations: a collapsible list, so the buyer picks which session to enter.
 *
 * Must only be rendered outside an impersonation session: the impersonate
 * action never exists while one is active (no nested impersonation).
 */
export const OrganizationDrawerDelegations = () => {
  const { locale } = useSession()
  const { actingFor, error } = useDelegations()
  const { startSession, loading, error: startError } = useDelegatedSession()
  const [expanded, setExpanded] = useState(false)

  if (error || actingFor.length === 0) {
    return null
  }

  const rows = actingFor.map((delegation) => {
    const name =
      delegation.granterUsername?.trim() ||
      delegation.granterEmail?.trim() ||
      '–'
    const start = formatDelegationDate(delegation.startDate, locale, '')
    const end = delegation.endDate
      ? formatDelegationDate(delegation.endDate, locale, '')
      : null

    return (
      <li key={delegation.id} data-fs-organization-drawer-delegations-row>
        <span data-fs-organization-drawer-delegations-icon aria-hidden="true">
          <SupervisorAccountIcon />
        </span>
        <span
          data-fs-organization-drawer-delegations-tooltip={labels.rowTooltip(
            start,
            end
          )}
        >
          <span data-fs-organization-drawer-delegations-name>{name}</span>
        </span>
        <button
          type="button"
          data-fs-organization-drawer-delegations-action
          disabled={loading}
          onClick={() =>
            void startSession({
              originalUserId: delegation.granterUserId,
              delegationId: delegation.id,
            })
          }
        >
          {labels.impersonate}
        </button>
      </li>
    )
  })

  return (
    <div data-fs-organization-drawer-delegations>
      {actingFor.length > 1 && (
        <button
          type="button"
          data-fs-organization-drawer-delegations-toggle
          aria-expanded={expanded}
          onClick={() => setExpanded((value) => !value)}
        >
          <span data-fs-organization-drawer-delegations-icon aria-hidden="true">
            <Icon
              name="CaretRight"
              width={18}
              height={18}
              data-fs-organization-drawer-delegations-chevron={expanded}
            />
          </span>
          <span
            data-fs-organization-drawer-delegations-tooltip={labels.countTooltip(
              actingFor.length
            )}
          >
            <span data-fs-organization-drawer-delegations-count>
              {labels.count(actingFor.length)}
            </span>
          </span>
        </button>
      )}
      {(actingFor.length === 1 || expanded) && (
        <ul data-fs-organization-drawer-delegations-list>{rows}</ul>
      )}
      {startError && (
        <p data-fs-organization-drawer-delegations-error role="alert">
          {labels.startError}
        </p>
      )}
    </div>
  )
}
