'use client'

import type { FormEvent } from 'react'
import { useRef } from 'react'

import type { InputFieldProps } from '@faststore/ui'
import { useUI } from '@faststore/ui'

import { useNewsletter } from 'app/sdk/newsletter/useNewsletter'
import { useOverrideComponents } from 'app/sdk/overrides/OverrideContext'

import type { NewsletterProps as SectionNewsletterProps } from 'app/components/sections/Newsletter'

export type NewsletterProps = SectionNewsletterProps

function Newsletter({
  icon: { icon, alt: iconAlt },
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
  colorVariant,
}: NewsletterProps) {
  const {
    Button,
    HeaderIcon,
    InputFieldName,
    InputFieldEmail,
    Newsletter: NewsletterWrapper,
    NewsletterAddendum,
    NewsletterContent,
    NewsletterForm,
    NewsletterHeader,
    ToastIconError,
    ToastIconSuccess,
  } = useOverrideComponents<'Newsletter'>()

  const { pushToast } = useUI()
  const { subscribeUser, loading, data } = useNewsletter()

  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  const onSubmit = (event: FormEvent) => {
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

    formRef.current.reset()
  }

  return (
    <NewsletterWrapper.Component
      card={card}
      colorVariant={colorVariant}
      {...NewsletterWrapper.props}
    >
      <NewsletterForm.Component
        ref={formRef}
        onSubmit={onSubmit}
        {...NewsletterForm.props}
      >
        <NewsletterHeader.Component
          title={title}
          description={description}
          icon={
            <HeaderIcon.Component
              width={32}
              height={32}
              {...HeaderIcon.props}
              name={icon ?? HeaderIcon.props.name}
              aria-label={iconAlt ?? HeaderIcon.props['aria-label']}
            />
          }
          {...NewsletterHeader.props}
        />

        <NewsletterContent.Component {...NewsletterContent.props}>
          {displayNameInput && (
            <InputFieldName.Component
              id="newsletter-name"
              required
              {...(InputFieldName.props as InputFieldProps)}
              label={nameInputLabel ?? InputFieldName.props.label}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              inputRef={nameInputRef}
            />
          )}
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
        </NewsletterContent.Component>
      </NewsletterForm.Component>
    </NewsletterWrapper.Component>
  )
}

export default Newsletter
