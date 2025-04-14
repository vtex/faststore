import { useRef } from 'react'

import { Button as UIButton, Icon as UIIcon, useUI } from '@faststore/ui'
import { session as initialSession } from 'discovery.config'
import { useSession } from 'src/sdk/session'
import { textToTitleCase } from 'src/utils/utilities'

import storeConfig from 'discovery.config'
import RegionPopover from '../RegionPopover'

function RegionButton({ icon, label }: { icon: string; label: string }) {
  const { openModal } = useUI()
  const { city, postalCode } = useSession()
  const shouldDisplayPostalCode = postalCode !== initialSession.postalCode

  const {
    session: { postalCode: defaultPostalCode },
  } = storeConfig

  const buttonRef = useRef<HTMLButtonElement>(null)

  return (
    <>
      <UIButton
        variant="tertiary"
        size="small"
        icon={<UIIcon name={icon} width={18} height={18} weight="bold" />}
        iconPosition="left"
        onClick={openModal}
      >
        {city && postalCode
          ? `${textToTitleCase(city)}${shouldDisplayPostalCode ? `, ${postalCode}` : ''}`
          : label}
      </UIButton>

      <RegionPopover
        open={defaultPostalCode ? false : true}
        triggerRef={buttonRef}
        onDismiss={() => {}}
        offsetTop={-65}
      />
    </>
  )
}

export default RegionButton
