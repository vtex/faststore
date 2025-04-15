import type { PopoverProps as UIPopoverProps } from '@faststore/ui'
import {
  Icon as UIIcon,
  InputField as UIInputField,
  Link as UILink,
  Popover as UIPopover,
  useUI,
} from '@faststore/ui'
import { useRef, useState } from 'react'

import { useSetLocation } from './../RegionModal/useSetLocation'

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
      alt: string
    }
  }
  triggerRef?: UIPopoverProps['triggerRef']
  onDismiss: UIPopoverProps['onDismiss']
  offsetTop?: UIPopoverProps['offsetTop']
  offsetLeft?: UIPopoverProps['offsetLeft']
  placement?: UIPopoverProps['placement']
}

function RegionPopover({
  triggerRef,
  offsetTop,
  offsetLeft,
  placement = 'bottom-start',
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
}: RegionPopoverProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = useState(true)
  const { isValidating, ...session } = useSession()
  const { city, postalCode } = sessionStore.read()
  const { popover: displayPopover } = useUI()

  const defaultOffsetTop = 54 // 48px + 6px (offset)

  const locationText = city
    ? `${textToTitleCase(city)}, ${postalCode}`
    : postalCode

  const {
    input,
    setInput,
    handleSubmit: setLocation,
    resetInputField,
    loading,
    errorMessage,
    setErrorMessage,
  } = useSetLocation()

  const handleSubmit = async () => {
    if (isValidating) {
      return
    }

    await setLocation(
      inputRef.current?.value,
      inputFieldErrorMessage,
      session,
      () => {
        setOpen(false)
      }
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
        Your current location is <span>{locationText}</span>. Use the field
        below to change it.
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
      {displayPopover && (
        <div className={`${styles.section} section-region-popover`}>
          <UIPopover
            data-fs-region-popover
            title={title}
            isOpen={isOpen}
            content={RegionPopoverContent}
            placement={placement}
            dismissible
            onDismiss={() => setOpen(false)}
            triggerRef={triggerRef}
            offsetTop={offsetTop ? offsetTop : defaultOffsetTop}
            offsetLeft={offsetLeft}
            closeButtonAriaLabel={closeButtonAriaLabel}
          />
        </div>
      )}
    </>
  )
}

export default RegionPopover
