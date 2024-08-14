import type { FormEvent } from 'react'
import { useRef } from 'react'

import { useUI } from '@faststore/ui'

import {
  Button,
  Icon,
  InputField,
  NewsletterContent,
  NewsletterForm,
  NewsletterHeader,
  Newsletter as NewsletterWrapper,
} from '@faststore/ui'
import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'

import { NewsletterAddendum } from 'src/components/ui/Newsletter'

import type { NewsletterProps as SectionNewsletterProps } from 'src/components/sections/Newsletter'

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
        icon: <Icon width={30} height={30} name={toastSubscribe.icon} />,
      })
    } else {
      pushToast({
        ...toastSubscribeError,
        status: 'ERROR',
        icon: <Icon width={30} height={30} name={toastSubscribe.icon} />,
      })
    }

    formRef.current.reset()
  }

  return (
    <NewsletterWrapper card={card} colorVariant={colorVariant}>
      <NewsletterForm ref={formRef} onSubmit={onSubmit}>
        <NewsletterHeader
          title={title}
          description={description}
          icon={
            <Icon width={32} height={32} name={icon} aria-label={iconAlt} />
          }
        />

        <NewsletterContent>
          {displayNameInput && (
            <InputField
              id="newsletter-name"
              required
              label={nameInputLabel}
              // Dynamic props shouldn't be overridable
              // This decision can be reviewed later if needed
              inputRef={nameInputRef}
            />
          )}
          <InputField
            id="newsletter-email"
            type="email"
            required
            label={emailInputLabel}
            // Dynamic props shouldn't be overridable
            // This decision can be reviewed later if needed
            inputRef={emailInputRef}
          />
          <NewsletterAddendum addendum={privacyPolicy} />
          <Button variant="secondary" inverse type="submit">
            {loading ? subscribeButtonLoadingLabel : subscribeButtonLabel}
          </Button>
        </NewsletterContent>
      </NewsletterForm>
    </NewsletterWrapper>
  )
}

export default Newsletter
