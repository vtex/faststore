import {
  Icon as UIIcon,
  InputField as UIInputField,
  Link as UILink,
  Popover as UIPopover,
} from '@faststore/ui'
import React, { useRef, useState } from 'react'

import { sessionStore } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'

function RegionPopover({
  open,
  triggerRef,
  onDismiss,
  offsetTop,
  offsetLeft,
  placement = 'bottom-start',
}: {
  open: boolean
  triggerRef?: React.RefObject<HTMLButtonElement>
  onDismiss: () => void
  offsetTop?: number
  offsetLeft?: number
  placement?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isOpen, setOpen] = useState(true)

  const { city, postalCode } = sessionStore.read()
  const locationText = city
    ? `${textToTitleCase(city)}, ${postalCode}`
    : postalCode

  const resetInputField = () => {
    setInput('')
    setErrorMessage('')
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
        buttonActionText="Apply"
        onInput={(e) => {
          setInput(e.currentTarget.value)
        }}
        onSubmit={() => {
          // Handle form submission
        }}
        onClear={resetInputField}
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
