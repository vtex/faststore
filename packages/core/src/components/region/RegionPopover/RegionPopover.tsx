import type { PopoverProps as UIPopoverProps } from '@faststore/ui'
import {
  Icon as UIIcon,
  InputField as UIInputField,
  Link as UILink,
  Popover as UIPopover,
  useUI,
} from '@faststore/ui'
import { useRef, useState } from 'react'

import { useRegion } from './../RegionModal/useRegion'

import { sessionStore, useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'
import styles from './section.module.scss'

interface RegionPopoverProps {
  title?: UIPopoverProps['title']
  closeButtonAriaLabel?: UIPopoverProps['closeButtonAriaLabel']
  inputField?: {
    label?: string
    errorMessage?: string
    buttonActionText?: string
  }
  idkPostalCodeLink?: {
    text?: string
    to?: string
    icon?: {
      icon?: string
      alt?: string
    }
  }
  textBeforeLocation?: string
  textAfterLocation?: string
  description?: string
  triggerRef?: UIPopoverProps['triggerRef']
  onDismiss: UIPopoverProps['onDismiss']
  offsetTop?: UIPopoverProps['offsetTop']
  offsetLeft?: UIPopoverProps['offsetLeft']
  placement?: UIPopoverProps['placement']
}

function RegionPopover({
  title = 'Set your location',
  closeButtonAriaLabel,
  inputField: {
    label: inputFieldLabel,
    errorMessage: inputFieldErrorMessage,
    buttonActionText: inputButtonActionText,
  },
  idkPostalCodeLink: {
    text: idkPostalCodeLinkText,
    to: idkPostalCodeLinkTo,
    icon: { icon: idkPostalCodeLinkIcon, alt: idkPostalCodeLinkIconAlt },
  },
  textBeforeLocation = 'Your current location is:',
  textAfterLocation = 'Use the field below to change it.',
  description = 'Offers and availability vary by location.',
  triggerRef,
  offsetTop = 6,
  offsetLeft,
  placement = 'bottom-start',
}: RegionPopoverProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = useState(true)
  const { isValidating, ...session } = useSession()
  const { popover: displayPopover, closePopover } = useUI()
  const {
    input,
    setInput,
    setLocation,
    resetInputField,
    loading,
    errorMessage,
    setErrorMessage,
    isValidationComplete,
    postalCode,
  } = useRegion()
  const { city } = sessionStore.read()

  const location = city ? `${textToTitleCase(city)}, ${postalCode}` : postalCode

  const handleSubmit = async () => {
    if (!isValidationComplete) {
      return
    }

    await setLocation(
      inputRef.current?.value,
      inputFieldErrorMessage,
      session,
      () => setOpen(false)
    )
  }

  const idkPostalCodeLinkProps = {
    href: idkPostalCodeLinkTo ?? '#',
    children: (
      <>
        {idkPostalCodeLinkText}
        {!!idkPostalCodeLinkIcon && (
          <UIIcon
            name={idkPostalCodeLinkIcon}
            aria-label={idkPostalCodeLinkIconAlt}
            width={20}
            height={20}
          />
        )}
      </>
    ),
  }

  const RegionPopoverContent = (
    <>
      <span data-fs-region-popover-description>
        {postalCode ? (
          <>
            {textBeforeLocation} <span>{location}</span>. {textAfterLocation}
          </>
        ) : (
          <>{description}</>
        )}
      </span>
      <UIInputField
        data-fs-region-popover-input
        id="region-popover-input-postal-code"
        inputRef={inputRef}
        label={inputFieldLabel}
        actionable
        value={input}
        onInput={(e) => {
          errorMessage !== '' && setErrorMessage('')
          setInput(e.currentTarget.value)
        }}
        onSubmit={handleSubmit}
        onClear={resetInputField}
        buttonActionText={loading ? '...' : inputButtonActionText}
        error={errorMessage}
      />
      <UILink data-fs-region-popover-link {...idkPostalCodeLinkProps} />
    </>
  )

  return (
    <>
      {displayPopover.isOpen && (
        <div className={`${styles.section} section-region-popover`}>
          <UIPopover
            data-fs-region-popover
            title={title}
            isOpen={isOpen}
            content={RegionPopoverContent}
            placement={placement}
            dismissible
            onDismiss={() => {
              setOpen(false)
              closePopover
            }}
            triggerRef={triggerRef}
            offsetTop={offsetTop}
            offsetLeft={offsetLeft}
            closeButtonAriaLabel={closeButtonAriaLabel}
          />
        </div>
      )}
    </>
  )
}

export default RegionPopover
