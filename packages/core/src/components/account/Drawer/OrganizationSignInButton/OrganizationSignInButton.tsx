import { Button, Icon } from '@faststore/ui'
import { useState, type MouseEvent } from 'react'
import { useAccountNavigationLabels } from 'src/sdk/account/accountPageContext'
import { useSession } from 'src/sdk/session'
import { OrganizationDrawer } from '../OrganizationDrawer/OrganizationDrawer'

export const OrganizationSignInButton = ({
  icon: { alt, icon },
  isRepresentative,
}: {
  icon: { alt: string; icon: string }
  isRepresentative?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { person, b2b } = useSession()
  const navigationLabels = useAccountNavigationLabels()
  const companyLabel = navigationLabels?.companyLabel ?? 'Company'
  const contractLabel = navigationLabels?.contractLabel ?? 'Contract'
  const activeContractName = b2b?.contractName?.trim()
  const label =
    activeContractName || (person?.id ? companyLabel : contractLabel)

  const openDrawer = (
    event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault()
    setIsOpen(true)
  }

  const closeDrawer = () => {
    setIsOpen(false)
  }

  return (
    <>
      <Button
        data-fs-button-signin-link
        onClick={(event) => openDrawer(event)}
        className="text__title-mini"
        aria-label={alt}
        variant="tertiary"
        icon={<Icon name={icon} width={18} height={18} weight="bold" />}
        iconPosition="left"
      >
        {label}
      </Button>

      {isOpen && (
        <OrganizationDrawer
          isOpen={isOpen}
          closeDrawer={closeDrawer}
          isRepresentative={isRepresentative}
        />
      )}
    </>
  )
}
