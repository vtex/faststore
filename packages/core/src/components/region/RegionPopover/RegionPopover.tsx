import type { PopoverProps as UIPopoverProps } from '@faststore/ui'
import {
  Icon as UIIcon,
  InputField as UIInputField,
  Link as UILink,
  Popover as UIPopover,
  useUI,
} from '@faststore/ui'
import { useRef, useState } from 'react'

import useRegion from '../RegionModal/useRegion'

import { sessionStore, useSession } from 'src/sdk/session'
import { getGlobalSettings } from 'src/utils/globalSettings'
import { useDeliveryPromise } from 'src/sdk/deliveryPromise'
import { textToTitleCase } from 'src/utils/utilities'

import styles from './section.module.scss'

interface RegionPopoverProps {
  title?: UIPopoverProps['title']
  closeButtonAriaLabel?: UIPopoverProps['closeButtonAriaLabel']
  inputField?: {
    label?: string
    errorMessage?: string
    noProductsAvailableErrorMessage?: string
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

function RegionPopover(regionPopoverProps: RegionPopoverProps) {
  const {
    title = 'Set your location',
    closeButtonAriaLabel,
    textBeforeLocation = 'Your current location is:',
    textAfterLocation = 'Use the field below to change it.',
    description = 'Offers and availability vary by location.',
    triggerRef,
    offsetTop = 6,
    offsetLeft,
    placement = 'bottom-start',
    ...otherRegionPopoverProps
  } = regionPopoverProps
  const cmsData = getGlobalSettings(otherRegionPopoverProps)
  const {
    inputField: {
      label: inputFieldLabel = '',
      errorMessage: inputFieldErrorMessage = '',
      noProductsAvailableErrorMessage:
        inputFieldNoProductsAvailableErrorMessage = '',
      buttonActionText: inputButtonActionText = '',
    } = {},
    idkPostalCodeLink: {
      text: idkPostalCodeLinkText = '',
      to: idkPostalCodeLinkTo = '',
      icon: {
        icon: idkPostalCodeLinkIcon = '',
        alt: idkPostalCodeLinkIconAlt = '',
      } = {},
    } = {},
  } = cmsData?.regionalization ?? {}

  const inputRef = useRef<HTMLInputElement>(null)
  const { isValidating, ...session } = useSession()
  const { popover: displayPopover, closePopover } = useUI()
  const { onPostalCodeChange } = useDeliveryPromise()
  const { city, postalCode } = sessionStore.read()
  const location = city ? `${textToTitleCase(city)}, ${postalCode}` : postalCode

  const [input, setInput] = useState<string>('')

  const { loading, setRegion, regionError, setRegionError } = useRegion()

  const handleSubmit = async () => {
    if (isValidating) {
      return
    }

    await setRegion({
      session,
      onSuccess: () => {
        onPostalCodeChange()
        setInput('')
        closePopover()
      },
      postalCode: input,
      errorMessage: inputFieldErrorMessage,
      noProductsAvailableErrorMessage:
        inputFieldNoProductsAvailableErrorMessage,
    })
  }

  const idkPostalCodeLinkProps = {
    href: idkPostalCodeLinkTo,
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
          regionError !== '' && setRegionError('')
          setInput(e.currentTarget.value)
        }}
        onSubmit={handleSubmit}
        onClear={() => {
          setInput('')
          setRegionError('')
        }}
        buttonActionText={loading ? '...' : inputButtonActionText}
        error={regionError}
      />
      {idkPostalCodeLinkTo && (
        <UILink data-fs-region-popover-link {...idkPostalCodeLinkProps} />
      )}
    </>
  )

  return (
    <>
      {displayPopover.isOpen && (
        <div className={`${styles.section} section-region-popover`}>
          <UIPopover
            data-fs-region-popover
            title={title}
            isOpen={displayPopover.isOpen}
            content={RegionPopoverContent}
            placement={placement}
            dismissible
            triggerRef={triggerRef}
            offsetTop={offsetTop}
            offsetLeft={offsetLeft}
            closeButtonAriaLabel={closeButtonAriaLabel}
            onEntered={() => {
              if (!postalCode && inputRef.current) {
                inputRef.current.focus()
              }
            }}
          />
        </div>
      )}
    </>
  )
}

export default RegionPopover
