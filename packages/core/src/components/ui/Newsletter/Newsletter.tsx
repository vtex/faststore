import { Button as UIButton, InputField as UIInputField } from '@faststore/ui'
import { ComponentPropsWithRef, FormEvent } from 'react'
import { forwardRef, useRef } from 'react'
import { convertFromRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import { Icon, useUI } from '@faststore/ui'
import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'

const cmsToHtml = (content) => {
  if (!content) {
    return ''
  }
  const rawDraftContentState = JSON.parse(content)
  const html = stateToHTML(convertFromRaw(rawDraftContentState), {
    entityStyleFn: (entity) => {
      const entityType = entity.get('type').toLowerCase()
      if (entityType === 'link') {
        const data = entity.getData()
        return {
          element: 'a',
          attributes: {
            'data-fs-link': 'true',
            'data-fs-link-variant': 'inline',
            'data-fs-link-inverse': 'true',
            'data-fs-link-size': 'regular',
            'data-testid': 'fs-link',
            href: data.url,
          },
        }
      }
    },
  })

  return html
}

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
      ...otherProps
    },
    ref
  ) {
    const { subscribeUser, loading, data } = useNewsletter()
    const nameInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)
    const subscriptionButtonLabel = loading
      ? subscribeButtonLoadingLabel
      : subscribeButtonLabel

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
          icon: <Icon name={toastSubscribe.icon} width={30} height={30} />,
        })
      } else {
        pushToast({
          ...toastSubscribeError,
          status: 'ERROR',
          icon: <Icon name={toastSubscribeError.icon} width={30} height={30} />,
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
              <Icon name={icon?.icon} width={32} height={32} />
              {title}
            </h3>
            {description && <span> {description}</span>}
          </header>

          <div data-fs-newsletter-controls>
            <>
              {displayNameInput ? (
                <UIInputField
                  inputRef={nameInputRef}
                  id="newsletter-name"
                  label={nameInputLabel}
                  required
                />
              ) : null}
              <UIInputField
                inputRef={emailInputRef}
                id="newsletter-email"
                label={emailInputLabel}
                type="email"
                required
              />
              <span
                data-fs-newsletter-addendum
                dangerouslySetInnerHTML={{
                  __html: cmsToHtml(privacyPolicy),
                }}
              ></span>
              <UIButton
                variant="secondary"
                inverse
                type="submit"
                aria-label={subscriptionButtonLabel}
              >
                {subscriptionButtonLabel}
              </UIButton>
            </>
          </div>
        </form>
      </div>
    )
  }
)

export default Newsletter
