// AI GENERATED CODE
import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { useRouter } from 'next/router'
import { useRef } from 'react'

import { localizationStore } from 'src/sdk/session/useSessionSettings'
import localesData from '../../../../../locales-test.json'

import styles from './section.module.scss'

export interface LocaleSelectorProps {
  /**
   * Icon to display next to locale code
   */
  icon?: {
    name: string
    alt: string
  }
  /**
   * Aria label for the locale selector button
   */
  buttonAriaLabel?: string
}

function LocaleSelector({
  icon,
  buttonAriaLabel = 'Select language and region',
}: LocaleSelectorProps) {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { popover, openPopover, closePopover } = useUI()

  // Get current locale from router
  const currentLocale = router.locale ?? localesData.defaultLocale

  // Get available locales from the store
  const { locales } = localizationStore.read()

  const handleLocaleChange = async (newLocale: string) => {
    if (newLocale === currentLocale) {
      closePopover()
      return
    }

    // Use Next.js router to change locale
    // This will trigger getStaticProps to refetch with new locale
    // and useSessionSettings will update the session stores
    await router.push(router.asPath, router.asPath, { locale: newLocale })
    closePopover()
  }

  const handleTogglePopover = () => {
    if (popover.isOpen) {
      closePopover()
    } else {
      openPopover({
        isOpen: true,
        triggerRef: buttonRef,
      })
    }
  }

  // Build locale list content
  const LocaleListContent = (
    <div data-fs-locale-selector-list>
      {locales.map((localeCode) => {
        const localeConfig = (localesData.locales as any)[localeCode]
        const isCurrentLocale = localeCode === currentLocale
        const displayName = localeConfig?.languageName || localeCode

        return (
          <button
            key={localeCode}
            data-fs-locale-selector-option
            data-fs-locale-selector-option-selected={isCurrentLocale}
            onClick={() => handleLocaleChange(localeCode)}
            type="button"
            aria-current={isCurrentLocale ? 'true' : 'false'}
          >
            <span data-fs-locale-selector-option-name>{displayName}</span>
            <span data-fs-locale-selector-option-code>({localeCode})</span>
            {isCurrentLocale && (
              <UIIcon
                name="Check"
                width={16}
                height={16}
                aria-label="Current locale"
              />
            )}
          </button>
        )
      })}
    </div>
  )

  return (
    <div className={`${styles.section} section-locale-selector`}>
      <UIButton
        ref={buttonRef}
        data-fs-locale-selector-button
        onClick={handleTogglePopover}
        variant="tertiary"
        size="small"
        aria-label={buttonAriaLabel}
        aria-expanded={popover.isOpen}
        aria-haspopup="true"
      >
        {icon && (
          <UIIcon
            name={icon.name}
            width={18}
            height={18}
            aria-label={icon.alt}
          />
        )}
        <span data-fs-locale-selector-current>{currentLocale}</span>
        <UIIcon name="CaretDown" width={16} height={16} aria-hidden="true" />
      </UIButton>

      {popover.isOpen && (
        <div
          data-fs-locale-selector-popover
          className={styles.popover}
          role="menu"
          aria-label="Available locales"
        >
          {LocaleListContent}
        </div>
      )}
    </div>
  )
}

LocaleSelector.$componentKey = 'LocaleSelector'

export default LocaleSelector
