import { Button as UIButton, InputField as UIInputField } from '@faststore/ui'
import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'

import { Icon, useUI } from '@faststore/ui'
import Link from 'src/components/ui/Link'
import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Icon for the section.
   */
  icon: {
    iconName: string
    iconAlt: string
  }
  /**
   * Title for the section.
   */
  title: ReactNode
  /**
   * A description for the section.
   */
  description?: ReactNode
  /**
   * The Privacy Policy disclaimer.
   */
  privacyPolicy?: string
  /**
   * The email input label.
   */
  emailInputLabel?: string
  /**
   * The name input visibility.
   */
  displayNameInput?: boolean
  /**
   * The name input label.
   */
  nameInputLabel?: string
  /**
   * The subscribe button label.
   */
  subscribeButtonLabel?: string
  /**
   * The card Variant
   */
  card?: Boolean
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter(
    {
      icon,
      title,
      description,
      privacyPolicy,
      emailInputLabel,
      displayNameInput,
      nameInputLabel,
      subscribeButtonLabel,
      card,
      ...otherProps
    },
    ref
  ) {
    const { subscribeUser, loading, data } = useNewsletter()
    const nameInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)

    const { pushToast } = useUI()

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault()
      subscribeUser({
        data: {
          name: nameInputRef.current?.value ?? '',
          email: emailInputRef.current?.value ?? '',
        },
      })

      if (data?.subscribeToNewsletter?.id) {
        pushToast({
          title: 'Hooray!',
          message: 'Thank for your subscription.',
          status: 'INFO',
          icon: <Icon name="CircleWavyCheck" width={30} height={30} />,
        })
      } else {
        pushToast({
          title: 'Oops.',
          message: 'Something went wrong. Please Try again.',
          status: 'ERROR',
          icon: <Icon name="CircleWavyWarning" width={30} height={30} />,
        })
      }

      const formElement = event.currentTarget as HTMLFormElement

      formElement.reset()
    }

    return (
      <div data-fs-newsletter={card ? 'card' : ''}>
        <form
          data-fs-newsletter-form
          ref={ref}
          onSubmit={handleSubmit}
          {...otherProps}
          className="layout__content"
        >
          <header data-fs-newsletter-header>
            <h3>
              <Icon name={icon.iconName} width={32} height={32} />
              {title}
            </h3>
            {description && <span> {description}</span>}
          </header>

          <div data-fs-newsletter-controls>
            <>
              <UIInputField
                inputRef={emailInputRef}
                id="newsletter-email"
                label={emailInputLabel}
                type="email"
                required
              />
              <span data-fs-newsletter-addendum>
                {privacyPolicy}
                <Link href="/" inverse variant="inline">
                  Privacy Policy.
                </Link>
              </span>
              {displayNameInput && (
                <UIInputField
                  inputRef={nameInputRef}
                  id="newsletter-name"
                  label={nameInputLabel}
                  required
                />
              )}
              <UIButton variant="secondary" inverse type="submit">
                {loading ? 'Loading...' : subscribeButtonLabel}
              </UIButton>
            </>
          </div>
        </form>
      </div>
    )
  }
)

export default Newsletter
