import { type CSSProperties, useId, useMemo, useState } from 'react'
import {
  Icon,
  InputField,
  SlideOver,
  useFadeEffect,
  useUI,
} from '@faststore/ui'

import {
  createDelegation,
  updateDelegation,
  useDelegateRoleComparison,
} from 'src/sdk/account/useDelegations'
import { ArrowBackIcon, CloseIcon } from './delegationIcons'
import { type DelegationLabels, fillLabel } from './delegationLabels'
import { renderLabel } from './delegationText'
import {
  type DelegateCandidate,
  type DelegationRow,
  type PeriodError,
  formatDelegationDate,
  getUserDisplayName,
  validatePeriod,
} from './delegationUtils'
import styles from './styles.module.scss'

// One third of the screen, at least 480px, never wider than the screen. The
// SlideOver global CSS is not layered, so only inline variables override it.
const DRAWER_WIDTH = 'min(max(33.333vw, 480px), 100vw)'

const DRAWER_STYLE = {
  '--fs-slide-over-partial-width-mobile': DRAWER_WIDTH,
  '--fs-slide-over-partial-width-notebook': DRAWER_WIDTH,
  '--fs-slide-over-partial-max-width-notebook': 'none',
} as CSSProperties

export type DelegationDrawerMode = 'add' | 'edit'

type DelegationDrawerProps = {
  mode: DelegationDrawerMode
  isOpen: boolean
  onClose: () => void
  /** Called after a successful change so the list can be refreshed. */
  onChanged: () => void
  labels: Required<DelegationLabels>
  locale: string
  /** Current day (`YYYY-MM-DD`), injected to keep the rules testable. */
  today: string
  userName: string
  candidates: DelegateCandidate[]
  delegation?: DelegationRow | null
}

type Step = 'form' | 'confirm'

type FormError = {
  field: 'delegate' | 'startDate' | 'endDate'
  message: string
}

const PERIOD_ERRORS: Record<
  Exclude<PeriodError, null>,
  { field: FormError['field']; label: keyof DelegationLabels }
> = {
  startDateRequired: { field: 'startDate', label: 'startDateRequiredError' },
  endBeforeStart: { field: 'endDate', label: 'endBeforeStartError' },
  endInPast: { field: 'endDate', label: 'endInPastError' },
}

/** Opens the native calendar on click; typing still works where it cannot. */
const openDatePicker = (input: HTMLInputElement) => {
  try {
    input.showPicker?.()
  } catch {
    // Already open or blocked by the browser.
  }
}

type DelegateComboboxProps = {
  labels: Required<DelegationLabels>
  candidates: DelegateCandidate[]
  selected: DelegateCandidate | undefined
  readOnlyName?: string
  onSelect: (userId: string) => void
  onClear: () => void
}

/** Searchable single-user selector, shown as a chip once a user is chosen. */
function DelegateCombobox({
  labels,
  candidates,
  selected,
  readOnlyName,
  onSelect,
  onClear,
}: DelegateComboboxProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const listId = useId()

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()

    return candidates.filter((candidate) =>
      term
        ? `${candidate.username ?? ''} ${candidate.email ?? ''}`
            .toLowerCase()
            .includes(term)
        : true
    )
  }, [candidates, query])

  const chipName = readOnlyName ?? (selected && getUserDisplayName(selected))

  return (
    <div data-fs-delegation-combobox>
      <div data-fs-delegation-combobox-box>
        {chipName ? (
          <span data-fs-delegation-chip>
            <span>{chipName}</span>
            {!readOnlyName && (
              <button
                type="button"
                data-fs-delegation-chip-remove
                aria-label={labels.removeSelectedAria}
                onClick={(event) => {
                  event.stopPropagation()
                  onClear()
                }}
              >
                <CloseIcon size={14} />
              </button>
            )}
          </span>
        ) : (
          <input
            data-fs-delegation-combobox-input
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-label={labels.delegateFieldLabel}
            placeholder={labels.delegatePlaceholder}
            value={query}
            disabled={candidates.length === 0}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onChange={(event) => {
              setQuery(event.target.value)
              setOpen(true)
            }}
          />
        )}
      </div>

      {candidates.length === 0 && !chipName && (
        <p data-fs-delegation-field-hint>{labels.noCandidatesMessage}</p>
      )}

      {open && !chipName && filtered.length > 0 && (
        <div
          id={listId}
          data-fs-delegation-combobox-list
          role="listbox"
          tabIndex={-1}
        >
          {filtered.map((candidate) => {
            const secondary =
              candidate.username && candidate.email ? candidate.email : null

            return (
              <div
                key={candidate.userId}
                role="option"
                tabIndex={-1}
                aria-selected={false}
                data-fs-delegation-combobox-option
                // mousedown fires before the input blur that closes the list.
                onMouseDown={(event) => {
                  event.preventDefault()
                  setQuery('')
                  setOpen(false)
                  onSelect(candidate.userId)
                }}
              >
                <span data-fs-delegation-option-primary>
                  {getUserDisplayName(candidate)}
                </span>
                {secondary && (
                  <span data-fs-delegation-option-secondary>{secondary}</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const DelegationDrawer = ({
  mode,
  isOpen,
  onClose,
  onChanged,
  labels,
  locale,
  today,
  userName,
  candidates,
  delegation,
}: DelegationDrawerProps) => {
  const { fade, fadeOut } = useFadeEffect()
  const { pushToast } = useUI()

  const [step, setStep] = useState<Step>('form')
  const [delegateUserId, setDelegateUserId] = useState('')
  const [startDate, setStartDate] = useState(delegation?.startDate ?? today)
  const [endDate, setEndDate] = useState(delegation?.endDate ?? '')
  const [formError, setFormError] = useState<FormError | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const selectedCandidate = candidates.find(
    (candidate) => candidate.userId === delegateUserId
  )
  const delegateName =
    mode === 'add'
      ? selectedCandidate
        ? getUserDisplayName(selectedCandidate)
        : ''
      : delegation
        ? getUserDisplayName(delegation)
        : ''

  const isConfirmStep = step === 'confirm'
  const { hasFewerRoles } = useDelegateRoleComparison(
    delegateUserId,
    isConfirmStep && mode === 'add'
  )
  const title = isConfirmStep
    ? labels.confirmTitle
    : mode === 'add'
      ? labels.addDrawerTitle
      : labels.editDrawerTitle

  const validate = (): FormError | null => {
    if (mode === 'add' && !delegateUserId) {
      return { field: 'delegate', message: labels.delegateRequiredError }
    }

    if (mode === 'edit' && delegation?.endDate && !endDate) {
      return { field: 'endDate', message: labels.endDateRequiredError }
    }

    const periodError = validatePeriod({ startDate, endDate, today })

    if (!periodError) {
      return null
    }

    const { field, label } = PERIOD_ERRORS[periodError]

    return { field, message: labels[label] }
  }

  const submit = async () => {
    setSubmitting(true)

    try {
      if (mode === 'add') {
        await createDelegation({
          delegateUserId,
          startDate,
          endDate: endDate || null,
        })
      } else if (mode === 'edit' && delegation) {
        const startChanged = startDate !== delegation.startDate
        const endChanged = endDate !== (delegation.endDate ?? '')

        // Nothing changed, nothing to send.
        if (!startChanged && !endChanged) {
          onClose()
          return
        }

        await updateDelegation(delegation.id, {
          startDate: startChanged ? startDate : null,
          endDate: endChanged ? endDate : null,
        })
      }

      pushToast({
        status: 'INFO',
        message: mode === 'add' ? labels.addedToast : labels.updatedToast,
        icon: <Icon width={30} height={30} name="CircleWavyCheck" />,
      })

      onChanged()
      onClose()
    } catch (error) {
      console.error('Error changing delegation:', error)

      pushToast({
        title: labels.errorToastTitle,
        status: 'ERROR',
        message: labels.errorToastMessage,
        icon: <Icon width={30} height={30} name="CircleWavyWarning" />,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleContinue = () => {
    const error = validate()

    setFormError(error)

    if (error) {
      return
    }

    if (mode === 'edit') {
      void submit()
      return
    }

    setStep('confirm')
  }

  const startLabel = formatDelegationDate(
    startDate,
    locale,
    labels.indefiniteLabel
  )

  const names = { delegate: delegateName, name: userName }
  const endLabel = formatDelegationDate(endDate, locale, labels.indefiniteLabel)

  return (
    <SlideOver
      data-fs-delegation-drawer
      style={DRAWER_STYLE}
      fade={fade}
      onDismiss={fadeOut}
      onTransitionEnd={() => fade === 'out' && onClose()}
      isOpen={isOpen}
      size="partial"
      direction="rightSide"
      overlayProps={{ className: styles.section }}
    >
      <div data-fs-delegation-drawer-header>
        <div data-fs-delegation-drawer-heading>
          {isConfirmStep && mode === 'add' && (
            <button
              type="button"
              data-fs-delegation-icon-button
              aria-label={labels.backLabel}
              disabled={submitting}
              onClick={() => setStep('form')}
            >
              <ArrowBackIcon />
            </button>
          )}
          <h2 data-fs-delegation-drawer-title>{title}</h2>
        </div>
        <button
          type="button"
          data-fs-delegation-icon-button
          aria-label={labels.closeAria}
          disabled={submitting}
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <div data-fs-delegation-drawer-body>
        {step === 'form' && (
          <>
            <p data-fs-delegation-drawer-intro>
              {renderLabel(labels.addDrawerDescription, { name: userName }, [
                'name',
              ])}
            </p>

            <div data-fs-delegation-form>
              <div data-fs-delegation-field>
                <span data-fs-delegation-field-label>
                  {labels.delegateFieldLabel}
                </span>
                <DelegateCombobox
                  labels={labels}
                  candidates={candidates}
                  selected={selectedCandidate}
                  readOnlyName={mode === 'edit' ? delegateName : undefined}
                  onSelect={(userId) => {
                    setFormError(null)
                    setDelegateUserId(userId)
                  }}
                  onClear={() => setDelegateUserId('')}
                />
                {formError?.field === 'delegate' && (
                  <p data-fs-delegation-error role="alert">
                    {formError.message}
                  </p>
                )}
              </div>

              <div data-fs-delegation-field>
                <span data-fs-delegation-field-label>{labels.periodLabel}</span>
                <div data-fs-delegation-period>
                  <InputField
                    id="delegation-start-date"
                    label={labels.startDateFieldLabel}
                    type="date"
                    inputMode="text"
                    value={startDate}
                    error={
                      formError?.field === 'startDate'
                        ? formError.message
                        : undefined
                    }
                    onClick={(event) => openDatePicker(event.currentTarget)}
                    onChange={(event) => {
                      setFormError(null)
                      setStartDate(event.target.value)
                    }}
                  />
                  {/* Empty end date: no native dd/mm/yyyy until the field is focused. */}
                  <div data-fs-delegation-end-field-empty={!endDate}>
                    <InputField
                      id="delegation-end-date"
                      label={labels.endDateFieldLabel}
                      type="date"
                      inputMode="text"
                      value={endDate}
                      min={startDate || undefined}
                      error={
                        formError?.field === 'endDate'
                          ? formError.message
                          : undefined
                      }
                      onClick={(event) => openDatePicker(event.currentTarget)}
                      onChange={(event) => {
                        setFormError(null)
                        setEndDate(event.target.value)
                      }}
                    />
                  </div>
                </div>
                <p data-fs-delegation-field-hint>{labels.endDateHint}</p>
              </div>
            </div>
          </>
        )}

        {isConfirmStep && mode === 'add' && (
          <div data-fs-delegation-confirm>
            <p data-fs-delegation-confirm-intro>
              {renderLabel(
                endDate ? labels.confirmIntro : labels.confirmIntroNoEndDate,
                { ...names, startDate: startLabel, endDate: endLabel },
                ['delegate', 'name']
              )}
            </p>
            <p data-fs-delegation-confirm-subtitle>
              {fillLabel(labels.confirmWhileActive, names)}
            </p>
            <ul data-fs-delegation-confirm-list>
              <li>{fillLabel(labels.confirmCapabilitySignIn, names)}</li>
              <li>{fillLabel(labels.confirmCapabilityData, names)}</li>
              <li>{fillLabel(labels.confirmCapabilityPermissions, names)}</li>
            </ul>
            {hasFewerRoles && (
              <p data-fs-delegation-confirm-warning>
                {renderLabel(labels.confirmFewerRolesNote, names, [
                  'delegate',
                  'name',
                ])}
              </p>
            )}
            <p data-fs-delegation-confirm-note>{labels.confirmRevokeNote}</p>
          </div>
        )}
      </div>

      <div data-fs-delegation-drawer-footer>
        {!isConfirmStep ? (
          <>
            <button
              type="button"
              data-fs-delegation-button
              data-fs-delegation-button-variant="text"
              disabled={submitting}
              onClick={onClose}
            >
              {labels.cancelLabel}
            </button>
            <button
              type="button"
              data-fs-delegation-button
              data-fs-delegation-button-variant="primary"
              aria-busy={submitting}
              onClick={handleContinue}
              disabled={
                submitting ||
                (mode === 'add' && !delegateUserId) ||
                (mode === 'add' && candidates.length === 0)
              }
            >
              {submitting && (
                <span data-fs-delegation-spinner aria-hidden="true" />
              )}
              {mode === 'edit'
                ? submitting
                  ? labels.savingLabel
                  : labels.saveLabel
                : labels.continueLabel}
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              data-fs-delegation-button
              data-fs-delegation-button-variant="text"
              disabled={submitting}
              onClick={() => setStep('form')}
            >
              {labels.backLabel}
            </button>
            <button
              type="button"
              data-fs-delegation-button
              data-fs-delegation-button-variant="primary"
              disabled={submitting}
              aria-busy={submitting}
              onClick={() => void submit()}
            >
              {submitting && (
                <span data-fs-delegation-spinner aria-hidden="true" />
              )}
              {submitting ? labels.confirmingLabel : labels.confirmLabel}
            </button>
          </>
        )}
      </div>
    </SlideOver>
  )
}
