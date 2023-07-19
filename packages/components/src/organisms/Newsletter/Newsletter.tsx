import React, { ComponentPropsWithRef, ReactNode } from 'react'
import { forwardRef } from 'react'

import { InputField, Button } from '../..'

export type SubscribeMessage = {
  title: string
  message: string
}

type ColorVariant = 'main' | 'light' | 'accent'

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Icon for the section.
   */
  icon?: ReactNode
  /**
   * Title for the section.
   */
  title: string
  /**
   * A description for the section.
   */
  description?: string
  /**
   * Specifies the Privacy Policy disclaimer.
   */
  privacyPolicy?: string
  /**
   * Specifies the email input label.
   */
  emailInputLabel?: string
  /**
   * Specifies the name input visibility.
   */
  displayNameInput?: boolean
  /**
   * Specifies the name input label.
   */
  nameInputLabel?: string
  /**
   * Specifies the subscribe button label.
   */
  subscribeButtonLabel?: string
  /**
   * Specifies the subscribe button loading label.
   */
  subscribeButtonLoadingLabel?: string
  /**
   * Specifies the component's color variant combination.
   */
  colorVariant: ColorVariant
  /**
   * Enables the card Variant
   */
  card: Boolean
  /**
   * Function called when submit button is clicked.
   */
  handleSubmit: () => void
  /**
   * Enables a loading state.
   */
  loading: Boolean
  toastSubscribe: SubscribeMessage
  toastSubscribeError: SubscribeMessage
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter(
    {
      icon,
      title,
      description,
      displayNameInput = true,
      subscribeButtonLabel = 'Subscribe',
      subscribeButtonLoadingLabel,
      colorVariant = 'main',
      handleSubmit,
      privacyPolicy,
      nameInputLabel = 'Name',
      emailInputLabel = 'Email',
      loading,
      card,
    },
    ref
  ) {
    return (
      <div
        data-fs-newsletter={card ? 'card' : ''}
        data-fs-content="newsletter"
        data-fs-newsletter-color-variant={colorVariant}
      >
        <form ref={ref} data-fs-newsletter-form onSubmit={handleSubmit}>
          <header data-fs-newsletter-header>
            <h3 data-fs-newsletter-header-title>
              {icon}
              {title}
            </h3>
            {description && <span> {description}</span>}
          </header>

          <div data-fs-newsletter-controls>
            <>
              {displayNameInput ? (
                <InputField
                  id="newsletter-name"
                  required
                  label={nameInputLabel}
                />
              ) : null}
              <InputField
                id="newsletter-email"
                type="email"
                required
                label={emailInputLabel}
              />
              <span data-fs-newsletter-addendum>{privacyPolicy}</span>
              <Button
                variant="secondary"
                type="submit"
                inverse={colorVariant === 'main'}
              >
                {loading ? subscribeButtonLoadingLabel : subscribeButtonLabel}
              </Button>
            </>
          </div>
        </form>
      </div>
    )
  }
)

export default Newsletter
