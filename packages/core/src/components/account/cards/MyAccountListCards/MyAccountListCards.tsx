import { useRouter } from 'next/router'
import type { KeyboardEvent } from 'react'
import { useMemo, useRef, useState } from 'react'

import {
  Button,
  EmptyState,
  Icon,
  IconButton,
  SearchInputField,
  Tooltip,
} from '@faststore/ui'

import AccountHeader from '../../components/Header'
import type { MyAccountListCardsSectionLabels } from './myAccountListCardsLabels'
import { resolveMyAccountListCardsLabels } from './myAccountListCardsLabels'
import styles from './styles.module.scss'

export type SavedCardItem = {
  accountId?: string | null
  bin?: string | null
  cardNumber?: string | null
  paymentSystem?: string | null
  paymentSystemName?: string | null
  isDefault?: boolean | null
  isActive?: boolean | null
}

export type CardsTabVariant = 'personal' | 'shared'

export type MyAccountListCardsProps = {
  personalCards: SavedCardItem[]
  sharedCards: SavedCardItem[]
  /** Whether the buyer has an Organizational Unit association — gates the Shared tab (FR-5). */
  hasOrgAssociation: boolean
  /**
   * Whether the buyer can view/manage personal cards — gates the Personal tab
   * (spec my-account-cards-gating-plan). Independent of route access, which
   * is never gated.
   */
  canViewPersonalCards: boolean
  /** Whether either list failed to load — renders the error state instead of the grid (US-5). */
  hasError?: boolean
  labels?: MyAccountListCardsSectionLabels
}

const PAGE_SIZE = 25
const PERSONAL_TAB_ID = 'fs-list-cards-tab-personal'
const SHARED_TAB_ID = 'fs-list-cards-tab-shared'
const PANEL_ID = 'fs-list-cards-panel'

function cardKey(card: SavedCardItem, index: number) {
  return card.accountId ? `${card.accountId}-${index}` : `card-${index}`
}

function matchesSearch(card: SavedCardItem, search: string) {
  if (!search) return true

  const needle = search.trim().toLowerCase()

  return (
    card.paymentSystemName?.toLowerCase().includes(needle) ||
    card.cardNumber?.toLowerCase().includes(needle) ||
    false
  )
}

// Maps the payment system name from the Saved-cards service to one of the
// brand icons available in this app's icon sprite (public/icons.svg). Falls
// back to a generic "Bag" icon for brands without a dedicated symbol.
const BRAND_ICON_BY_NAME: Record<string, string> = {
  visa: 'Visa',
  mastercard: 'Mastercard',
  amex: 'Amex',
  'american express': 'Amex',
  elo: 'EloCard',
  diners: 'Diners',
  'diners club': 'Diners',
  hipercard: 'Hipercard',
}

function getBrandIconName(card: SavedCardItem) {
  const name = card.paymentSystemName?.toLowerCase().trim() ?? ''
  return BRAND_ICON_BY_NAME[name] ?? 'Bag'
}

export default function MyAccountListCards({
  personalCards,
  sharedCards,
  hasOrgAssociation,
  canViewPersonalCards,
  hasError = false,
  labels: labelsProp,
}: MyAccountListCardsProps) {
  const router = useRouter()
  const labels = resolveMyAccountListCardsLabels(labelsProp)

  // Confirmed row (spec my-account-cards-gating-plan, O1): when Personal isn't
  // available but Shared is, no tab chrome renders — the shared list is shown
  // directly. The other two combinations (Personal only; neither) are
  // unconfirmed and keep the pre-existing tab-bar rendering unchanged.
  const sharedOnly = !canViewPersonalCards && hasOrgAssociation

  const [activeTab, setActiveTab] = useState<CardsTabVariant>(
    sharedOnly ? 'shared' : 'personal'
  )
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const personalTabRef = useRef<HTMLButtonElement>(null)
  const sharedTabRef = useRef<HTMLButtonElement>(null)

  const isShared = activeTab === 'shared'
  const allCards = isShared ? sharedCards : personalCards

  const filteredCards = useMemo(
    () => allCards.filter((card) => matchesSearch(card, search)),
    [allCards, search]
  )

  const total = filteredCards.length
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageCards = filteredCards.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const firstIndexLabel = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const lastIndexLabel = Math.min(currentPage * PAGE_SIZE, total)

  const handleTabChange = (tab: CardsTabVariant) => {
    setActiveTab(tab)
    setSearch('')
    setPage(1)
  }

  // Arrow-key navigation between tabs, per the WAI-ARIA tabs pattern. Only
  // meaningful when both tabs are rendered (hasOrgAssociation); a single tab
  // has nothing to move to.
  const handleTablistKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!hasOrgAssociation) return
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    event.preventDefault()
    const nextTab: CardsTabVariant = isShared ? 'personal' : 'shared'
    handleTabChange(nextTab)
    ;(nextTab === 'personal' ? personalTabRef : sharedTabRef).current?.focus()
  }

  const noCardsLabel = isShared
    ? labels.noSharedCardsLabel
    : labels.noPersonalCardsLabel

  return (
    <div className={styles.page} data-fs-list-cards>
      <AccountHeader pageTitle={labels.pageTitle} />

      {sharedOnly ? (
        <div data-fs-list-cards-tabs-shared-only>
          <span data-fs-list-cards-tab-label>{labels.sharedTabLabel}</span>
          <Tooltip
            content={labels.sharedCardsTooltipLabel}
            placement="bottom-start"
          >
            <Icon name="Info" width={24} height={24} />
          </Tooltip>
        </div>
      ) : (
        <div data-fs-list-cards-tabs-row>
          <div
            data-fs-list-cards-tabs
            role="tablist"
            onKeyDown={handleTablistKeyDown}
          >
            <button
              ref={personalTabRef}
              id={PERSONAL_TAB_ID}
              type="button"
              role="tab"
              aria-selected={!isShared}
              aria-controls={PANEL_ID}
              tabIndex={isShared ? -1 : 0}
              data-fs-list-cards-tab
              data-fs-list-cards-tab-active={!isShared}
              onClick={() => handleTabChange('personal')}
            >
              {labels.personalTabLabel}
            </button>
            {hasOrgAssociation && (
              <button
                ref={sharedTabRef}
                id={SHARED_TAB_ID}
                type="button"
                role="tab"
                aria-selected={isShared}
                aria-controls={PANEL_ID}
                tabIndex={isShared ? 0 : -1}
                data-fs-list-cards-tab
                data-fs-list-cards-tab-active={isShared}
                onClick={() => handleTabChange('shared')}
              >
                {labels.sharedTabLabel}
              </button>
            )}
          </div>
          {isShared && hasOrgAssociation && (
            <Tooltip
              content={labels.sharedCardsTooltipLabel}
              placement="bottom-start"
            >
              <Icon name="Info" width={24} height={24} />
            </Tooltip>
          )}
        </div>
      )}

      <div
        role={sharedOnly ? undefined : 'tabpanel'}
        id={sharedOnly ? undefined : PANEL_ID}
        aria-labelledby={
          sharedOnly ? undefined : isShared ? SHARED_TAB_ID : PERSONAL_TAB_ID
        }
      >
        {!hasError && (
          <div data-fs-list-cards-controls>
            <div data-fs-list-cards-search-wrapper>
              <SearchInputField
                data-fs-list-cards-search
                placeholder={labels.searchPlaceholder}
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
                onSubmit={() => {
                  setPage(1)
                }}
              />
            </div>
            {total > 0 && (
              <div data-fs-list-cards-pagination>
                <p>{`${firstIndexLabel} — ${lastIndexLabel} ${labels.paginationOfLabel} ${total}`}</p>
                <IconButton
                  size="small"
                  variant="tertiary"
                  disabled={currentPage === 1}
                  onClick={() => setPage((current) => current - 1)}
                  icon={<Icon name="CaretLeft" />}
                  aria-label={labels.previousPageLabel}
                />
                <IconButton
                  size="small"
                  variant="tertiary"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((current) => current + 1)}
                  icon={<Icon name="CaretRight" />}
                  aria-label={labels.nextPageLabel}
                />
              </div>
            )}
          </div>
        )}

        {hasError ? (
          <EmptyState
            testId="fs-list-cards-error"
            titleIcon={
              <Icon name="Warning" width={56} height={56} weight="thin" />
            }
            title={labels.errorTitleLabel}
            bkgColor="light"
          >
            <Button
              data-fs-list-cards-retry
              variant="secondary"
              onClick={() => router.reload()}
            >
              {labels.tryAgainLabel}
            </Button>
          </EmptyState>
        ) : total === 0 ? (
          <EmptyState
            testId="fs-list-cards-empty"
            titleIcon={
              <Icon
                name={search ? 'MagnifyingGlass' : 'Bag2'}
                width={56}
                height={56}
                weight="thin"
              />
            }
            title={search ? labels.noResultsLabel : noCardsLabel}
            bkgColor="light"
          />
        ) : (
          <div data-fs-list-cards-grid>
            {pageCards.map((card, index) => (
              <div key={cardKey(card, index)} data-fs-list-cards-item>
                <div data-fs-list-cards-item-brand>
                  <Icon name={getBrandIconName(card)} width={32} height={32} />
                </div>
                <div data-fs-list-cards-item-label>
                  {card.paymentSystemName ?? labels.genericCardLabel}
                  {card.isDefault && (
                    <span data-fs-list-cards-item-default-badge>
                      {labels.defaultCardLabel}
                    </span>
                  )}
                </div>
                <div data-fs-list-cards-item-number>{card.cardNumber}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
