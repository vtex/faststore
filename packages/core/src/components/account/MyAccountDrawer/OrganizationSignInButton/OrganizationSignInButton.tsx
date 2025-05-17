import { Icon, LinkButton } from '@faststore/ui'
import { useState, type MouseEvent } from 'react'
import { useSession } from 'src/sdk/session'
import { OrganizationDrawer } from '../OrganizationDrawer/OrganizationDrawer'

export const OrganizationSignInButton = ({
  icon: { alt, icon },
}: {
  icon: { alt: string; icon: string }
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
      <LinkButton
        data-fs-button-signin-link
        // href={person?.id ? `/account` : `/login`}
        onClick={(event) => openDrawer(event)}
        className="text__title-mini"
        aria-label={alt}
        variant="tertiary"
        icon={<Icon name={icon} width={18} height={18} weight="bold" />}
        iconPosition="left"
      >
        {person?.id ? 'Company' : 'Contract'}
      </LinkButton>

      {isOpen && (
        <OrganizationDrawer isOpen={isOpen} closeDrawer={closeDrawer} />
      )}
    </>
  )
}
