import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import {
  revokeDelegation,
  useDelegateCandidates,
  useDelegations,
} from 'src/sdk/account/useDelegations'
import { useDelegatedSession } from 'src/sdk/account/useDelegatedSession'
import { useSession } from 'src/sdk/session'
import { Icon, useUI } from '@faststore/ui'
import { DelegationDrawer, type DelegationDrawerMode } from './DelegationDrawer'
import { EditIcon, MoreVerticalIcon, RemoveCircleIcon } from './delegationIcons'
import type { DelegationLabels } from './delegationLabels'
import { resolveDelegationLabels } from './delegationLabels'
import {
  type DelegationRow,
  filterAvailableCandidates,
  formatDelegationDate,
  getUserDisplayName,
  toISODate,
} from './delegationUtils'
import styles from './styles.module.scss'

type DelegationTabProps = {
  /** Name of the logged-in buyer, highlighted in the heading and texts. */
  userName?: string
  labels?: DelegationLabels
}

type DrawerState = {
  mode: DelegationDrawerMode
  delegation: DelegationRow | null
} | null

type RowMenuProps = {
  labels: Required<DelegationLabels>
  onEdit: () => void
  onRemove: () => void
}

function RowMenu({ labels, onEdit, onRemove }: RowMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === 'Escape') {
          setOpen(false)
        }
        return
      }

      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)

    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div data-fs-delegation-menu ref={ref}>
      <button
        type="button"
        data-fs-delegation-menu-button
        aria-label={labels.moreOptionsAria}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
      >
        <MoreVerticalIcon />
      </button>

      {open && (
        <div data-fs-delegation-menu-list role="menu">
          <button
            type="button"
            role="menuitem"
            data-fs-delegation-menu-item
            onClick={() => {
              setOpen(false)
              onEdit()
            }}
          >
            <EditIcon />
            <span>{labels.editLabel}</span>
          </button>
          <button
            type="button"
            role="menuitem"
            data-fs-delegation-menu-item
            data-fs-delegation-menu-item-danger
            onClick={() => {
              setOpen(false)
              onRemove()
            }}
          >
            <RemoveCircleIcon />
            <span>{labels.removeLabel}</span>
          </button>
        </div>
      )}
    </div>
  )
}

type SectionTitleProps = {
  /** Label with a `{name}` token, replaced by the highlighted buyer name. */
  template: string
  name: string
}

function SectionTitle({ template, name }: SectionTitleProps) {
  // Without the token (e.g. a custom CMS label) the name goes after the text.
  const hasToken = template.includes('{name}')
  const [before, after = ''] = template.split('{name}')

  return (
    <h2 data-fs-delegation-title>
      {hasToken ? before : `${before} `}
      {name && <span data-fs-delegation-title-name>{name}</span>}
      {after}
    </h2>
  )
}

type DelegationListRow = {
  id: string
  name: string
  startDate: string
  endDate?: string | null
  /** Row actions. Omit for a read-only row. */
  actions?: ReactNode
  /** Shown on row hover, in the free column before the actions (e.g. Impersonate). */
  hoverAction?: ReactNode
}

type DelegationListProps = {
  rows: DelegationListRow[]
  labels: Required<DelegationLabels>
  locale: string
}

function DelegationList({ rows, labels, locale }: DelegationListProps) {
  if (rows.length === 0) {
    return (
      <div data-fs-delegation-empty>
        <span data-fs-delegation-empty-message>{labels.emptyMessage}</span>
      </div>
    )
  }

  return (
    <div role="table">
      <div data-fs-delegation-table-head role="row" tabIndex={-1}>
        <span role="columnheader">{labels.userColumnLabel}</span>
        <span role="columnheader">{labels.startDateColumnLabel}</span>
        <span role="columnheader">{labels.endDateColumnLabel}</span>
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </div>

      <div data-fs-delegation-table-body role="rowgroup">
        {rows.map((row) => (
          <div key={row.id} data-fs-delegation-row role="row" tabIndex={-1}>
            <span data-fs-delegation-user role="cell">
              {row.name}
            </span>
            <span data-fs-delegation-date-cell role="cell">
              {formatDelegationDate(
                row.startDate,
                locale,
                labels.indefiniteLabel
              )}
            </span>
            <span data-fs-delegation-date-cell role="cell">
              {formatDelegationDate(
                row.endDate,
                locale,
                labels.indefiniteLabel
              )}
            </span>
            {row.hoverAction ? (
              <span data-fs-delegation-hover-action role="cell">
                {row.hoverAction}
              </span>
            ) : (
              <span aria-hidden="true" />
            )}
            <span data-fs-delegation-actions role="cell">
              {row.actions}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function DelegationTab({
  userName = '',
  labels: labelsProp,
}: DelegationTabProps) {
  const labels = resolveDelegationLabels(labelsProp)
  const { locale, b2b } = useSession()
  const canImpersonate = !b2b?.actorId
  const today = toISODate(new Date())

  const { pushToast } = useUI()
  const [drawer, setDrawer] = useState<DrawerState>(null)
  const removing = useRef(false)
  const { startSession, loading: startingSession } = useDelegatedSession()

  const { delegations, actingFor, loading, error, refresh } = useDelegations()
  const { candidates } = useDelegateCandidates(drawer?.mode === 'add')

  const removeDelegation = async (delegation: DelegationRow) => {
    if (removing.current) {
      return
    }

    removing.current = true

    try {
      await revokeDelegation(delegation.id)

      pushToast({
        status: 'INFO',
        message: labels.removedToast,
        icon: <Icon width={30} height={30} name="CircleWavyCheck" />,
      })
      refresh()
    } catch (error) {
      console.error('Error removing delegation:', error)

      pushToast({
        title: labels.errorToastTitle,
        status: 'ERROR',
        message: labels.errorToastMessage,
        icon: <Icon width={30} height={30} name="CircleWavyWarning" />,
      })
    } finally {
      removing.current = false
    }
  }

  const impersonate = async (delegation: (typeof actingFor)[number]) => {
    const started = await startSession({
      originalUserId: delegation.granterUserId,
      delegationId: delegation.id,
    })

    if (!started) {
      pushToast({
        title: labels.errorToastTitle,
        status: 'ERROR',
        message: labels.errorToastMessage,
        icon: <Icon width={30} height={30} name="CircleWavyWarning" />,
      })
    }
  }

  const availableCandidates = useMemo(
    () => filterAvailableCandidates(candidates, delegations, today),
    [candidates, delegations, today]
  )

  return (
    <div data-fs-delegation className={styles.section}>
      <div data-fs-delegation-header>
        <SectionTitle
          template={labels.delegationSectionTitle}
          name={userName}
        />
        <button
          type="button"
          data-fs-delegation-add
          onClick={() => setDrawer({ mode: 'add', delegation: null })}
        >
          {labels.addLabel}
        </button>
      </div>

      {loading && <p role="status">…</p>}

      {error && !loading && (
        <div data-fs-delegation-error-state role="alert">
          <p>{labels.loadErrorMessage}</p>
          <button
            type="button"
            data-fs-delegation-add
            onClick={() => refresh()}
          >
            {labels.retryLabel}
          </button>
        </div>
      )}

      {!loading && !error && (
        <DelegationList
          rows={delegations.map((delegation) => ({
            id: delegation.id,
            name: getUserDisplayName(delegation),
            startDate: delegation.startDate,
            endDate: delegation.endDate,
            actions: (
              <RowMenu
                labels={labels}
                onEdit={() => setDrawer({ mode: 'edit', delegation })}
                onRemove={() => void removeDelegation(delegation)}
              />
            ),
          }))}
          labels={labels}
          locale={locale}
        />
      )}

      <div data-fs-delegation-header data-fs-delegation-header-secondary>
        <SectionTitle template={labels.actingForSectionTitle} name={userName} />
      </div>

      {!loading && !error && (
        <DelegationList
          rows={actingFor.map((delegation) => ({
            id: delegation.id,
            name: getUserDisplayName({
              username: delegation.granterUsername,
              email: delegation.granterEmail,
            }),
            startDate: delegation.startDate,
            endDate: delegation.endDate,
            hoverAction: canImpersonate ? (
              <button
                type="button"
                data-fs-delegation-impersonate
                disabled={startingSession}
                onClick={() => void impersonate(delegation)}
              >
                {labels.impersonateLabel}
              </button>
            ) : undefined,
          }))}
          labels={labels}
          locale={locale}
        />
      )}

      {drawer && (
        <DelegationDrawer
          // A fresh drawer (and form state) per action and delegation.
          key={`${drawer.mode}-${drawer.delegation?.id ?? 'new'}`}
          mode={drawer.mode}
          isOpen
          delegation={drawer.delegation}
          candidates={availableCandidates}
          labels={labels}
          locale={locale}
          today={today}
          userName={userName}
          onClose={() => setDrawer(null)}
          onChanged={() => refresh()}
        />
      )}
    </div>
  )
}
