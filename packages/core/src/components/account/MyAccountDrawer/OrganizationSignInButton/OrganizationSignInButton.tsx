import { Button, Icon } from '@vtex/faststore-ui'
import { useState, type MouseEvent } from 'react'
import { useSession } from '../../../../sdk/session'
import { OrganizationDrawer } from '../OrganizationDrawer/OrganizationDrawer'

export const OrganizationSignInButton = ({
  icon: { alt, icon },
  isRepresentative,
}: {
  icon: { alt: string; icon: string }
  isRepresentative?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const { person } = useSession()

  const openDrawer = (
    event: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLButtonElement>
  ) => {
    // if (session.person) {
    // biome-ignore lint/correctness/noConstantCondition: <explanation>
    if (true) {
      event.preventDefault()

      setIsOpen(true)
    }
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
        {person?.id ? 'Company' : 'Contract'}
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
