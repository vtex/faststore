import { useRef } from 'react'
import type { FormEvent } from 'react'

import { useUI } from '@faststore/ui'
import type { InputFieldProps } from '@faststore/ui'

import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'
import { useOverrideComponents } from 'src/sdk/overrides/OverrideContext'

import type { NewsletterProps as SectionNewsletterProps } from 'src/components/sections/Newsletter'

export type NewsletterProps = SectionNewsletterProps

function Newsletter({
  icon: iconProp,
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
  const { subscribeUser, loading } = useNewsletter()
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const emailInputRef = useRef<HTMLInputElement>(null)

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()

    try {
      const data = await subscribeUser({
        data: {
          name: nameInputRef.current?.value ?? '',
          email: emailInputRef.current?.value ?? '',
        },
      })

      if (data?.subscribeToNewsletter?.id) {
        pushToast({
          ...toastSubscribe,
          message: toastSubscribe?.message ?? '',
          status: 'INFO',
          icon: (
            <ToastIconSuccess.Component
              width={30}
              height={30}
              {...ToastIconSuccess.props}
              name={toastSubscribe?.icon ?? ToastIconSuccess.props.name ?? ''}
            />
          ),
        })

        formRef.current?.reset()
      }
    } catch (error) {
      pushToast({
        ...toastSubscribeError,
        message: toastSubscribeError?.message ?? '',
        status: 'ERROR',
        icon: (
          <ToastIconError.Component
            width={30}
            height={30}
            {...ToastIconError.props}
            name={toastSubscribe?.icon ?? ToastIconError.props.name ?? ''}
          />
        ),
      })
    }
  }

  return (
    <NewsletterWrapper.Component
      card={card ?? false}
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
              name={iconProp?.icon ?? HeaderIcon.props.name ?? ''}
              aria-label={iconProp?.alt ?? HeaderIcon.props['aria-label']}
            />
          }
          {...NewsletterHeader.props}
        />

        <NewsletterContent.Component {...NewsletterContent.props}>
          {displayNameInput && (
            <InputFieldName.Component
              required
              {...(InputFieldName.props as InputFieldProps)}
              id={InputFieldName.props.id ?? 'newsletter-name'}
              label={nameInputLabel ?? InputFieldName.props.label ?? ''}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              inputRef={nameInputRef}
            />
          )}
          <InputFieldEmail.Component
            type="email"
            required
            {...(InputFieldEmail.props as InputFieldProps)}
            id={InputFieldEmail.props.id ?? 'newsletter-email'}
            label={emailInputLabel ?? InputFieldEmail.props.label ?? ''}
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
