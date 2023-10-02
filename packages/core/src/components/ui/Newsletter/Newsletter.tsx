import { ComponentPropsWithRef, FormEvent, useMemo } from 'react'
import { forwardRef, useRef } from 'react'
import { useUI } from '@faststore/ui'
import type { InputFieldProps } from '@faststore/ui'

import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'
import {
  ToastIconSuccess,
  ToastIconError,
  HeaderIcon,
  InputFieldName,
  InputFieldEmail,
  Button,
  __experimentalNewsletterAddendum as NewsletterAddendum,
} from 'src/components/sections/Newsletter/Overrides'

export type SubscribeMessage = {
  title: string
  message: string
  icon: string
}

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Icon for the section.
   */
  icon: {
    icon: string
    alt: string
  }
  /**
   * Title for the section.
   */
  title: string
  /**
   * A description for the section.
   */
  description?: string
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
   * The subscribe button loading label.
   */
  subscribeButtonLoadingLabel?: string
  /**
   * The card Variant
   */
  card: Boolean

  toastSubscribe: SubscribeMessage

  toastSubscribeError: SubscribeMessage
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
      subscribeButtonLoadingLabel,
      card,
      toastSubscribe,
      toastSubscribeError,
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
          ...toastSubscribe,
          status: 'INFO',
          icon: (
            <ToastIconSuccess.Component
              width={30}
              height={30}
              {...ToastIconSuccess.props}
              name={toastSubscribe.icon ?? ToastIconSuccess.props.name}
            />
          ),
        })
      } else {
        pushToast({
          ...toastSubscribeError,
          status: 'ERROR',
          icon: (
            <ToastIconError.Component
              width={30}
              height={30}
              {...ToastIconError.props}
              name={toastSubscribe.icon ?? ToastIconError.props.name}
            />
          ),
        })
      }

      const formElement = event.currentTarget as HTMLFormElement

      formElement.reset()
    }

    return (
      <div data-fs-newsletter={card ? 'card' : ''}>
        <form
          ref={ref}
          data-fs-newsletter-form
          data-fs-content="newsletter"
          onSubmit={handleSubmit}
        >
          <header data-fs-newsletter-header>
            <h3>
              <HeaderIcon.Component
                width={32}
                height={32}
                {...HeaderIcon.props}
                name={icon?.icon ?? HeaderIcon.props.name}
              />
              {title}
            </h3>
            {description && <span> {description}</span>}
          </header>

          <div data-fs-newsletter-controls>
            <>
              {displayNameInput ? (
                <InputFieldName.Component
                  id="newsletter-name"
                  required
                  {...(InputFieldName.props as InputFieldProps)}
                  label={nameInputLabel ?? InputFieldName.props.label}
                  // Dynamic props shouldn't be overridable
                  // This decision can be reviewed later if needed
                  inputRef={nameInputRef}
                />
              ) : null}
              <InputFieldEmail.Component
                id="newsletter-email"
                type="email"
                required
                {...(InputFieldEmail.props as InputFieldProps)}
                label={emailInputLabel ?? InputFieldEmail.props.label}
                // Dynamic props shouldn't be overridable
                // This decision can be reviewed later if needed
                inputRef={emailInputRef}
              />
              <NewsletterAddendum.Component
                addendum={privacyPolicy}
                {...NewsletterAddendum.props}
              />
              <Button.Component
                variant="secondary"
                inverse
                type="submit"
                {...Button.props}
              >
                {loading ? subscribeButtonLoadingLabel : subscribeButtonLabel}
              </Button.Component>
            </>
          </div>
        </form>
      </div>
    )
  }
)

export default Newsletter
