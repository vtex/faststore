import {
  Icon as UIIcon,
  InputField as UIInputField,
  Link as UILink,
  Popover as UIPopover,
} from '@faststore/ui'
import React, { useRef, useState } from 'react'

import { useSetLocation } from './../RegionModal/useSetLocation'

import { sessionStore, useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'

function RegionPopover({
  triggerRef,
  onDismiss,
  offsetTop,
  offsetLeft,
  placement = 'bottom-start',
}: {
  triggerRef?: React.RefObject<HTMLButtonElement>
  onDismiss: () => void
  offsetTop?: number
  offsetLeft?: number
  placement?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isOpen, setOpen] = useState(true)
  const { isValidating, ...session } = useSession()

  const { city, postalCode } = sessionStore.read()
  const locationText = city
    ? `${textToTitleCase(city)}, ${postalCode}`
    : postalCode

  const inputFieldErrorMessage = 'Please enter a valid postal code'

  const {
    input,
    setInput,
    handleSubmit: setLocation,
    resetInputField,
    loading,
    errorMessage,
    setErrorMessage,
  } = useSetLocation()

  const inputButtonActionText = 'Apply'

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

  // TODO: Get this from hCMS
  const idkPostalCodeLinkText = 'I don’t know my postal code'
  const idkPostalCodeLinkIcon = 'ArrowSquareOut'
  const idkPostalCodeLinkIconAlt = 'Help icon'

  const idkPostalCodeLinkProps = {
    href: '#',
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
        label="Postal Code"
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
      <UIPopover
        data-fs-region-popover
        title="Set your location"
        dismissible
        isOpen={isOpen}
        content={RegionPopoverContent}
        placement="bottom-start"
        onDismiss={() => setOpen(false)}
        triggerRef={triggerRef}
        offsetTop={offsetTop}
      />
    </>
  )
}

export default RegionPopover
