import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { Form } from '@faststore/ui'

import { useUI } from 'src/sdk/ui/Provider'
import Icon from 'src/components/ui/Icon'
import Button from 'src/components/ui/Button'
import Link from 'src/components/ui/Link'
import InputText from 'src/components/ui/InputText'
import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'

import Section from '../Section'
import styles from './newsletter.module.scss'

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Title for the section.
   */
  title: ReactNode
  /**
   * A description for the section.
   */
  description?: ReactNode
  /**
   * The card Variant
   */
  card?: boolean
  /**
   * The compact version of the Newsletter component
   */
  lite?: boolean
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter(
    { title, description, card = false, lite = false, ...otherProps },
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
          icon: 'CircleWavyCheck',
        })
      } else {
        pushToast({
          title: 'Oops.',
          message: 'Something went wrong. Please Try again.',
          status: 'ERROR',
          icon: 'CircleWavyWarning',
        })
      }

      const formElement = event.currentTarget as HTMLFormElement

      formElement.reset()
    }

    return (
      <Section
        data-fs-newsletter={card ? 'card' : ''}
        className={`layout__section ${styles.fsNewsletter}`}
      >
        <Form
          data-fs-newsletter-form
          ref={ref}
          onSubmit={handleSubmit}
          {...otherProps}
          className="layout__content"
        >
          <header data-fs-newsletter-header>
            <h3>
              <Icon name="Envelop" width={32} height={32} />
              {title}
            </h3>
            {description && <span> {description}</span>}
          </header>

          <div data-fs-newsletter-controls>
            {lite ? (
              <>
                <InputText
                  inputRef={emailInputRef}
                  id="newsletter-email"
                  label="Your Email"
                  type="email"
                  required
                  actionable
                  onSubmit={() => undefined}
                  onClear={() => undefined}
                  buttonActionText="Subscribe"
                  displayClearButton={false}
                />
                <span data-fs-newsletter-addendum>
                  By subscribing to our newsletter you agree to to our{' '}
                  <Link href="/" inverse variant="inline">
                    Privacy Policy.
                  </Link>
                </span>
              </>
            ) : (
              <>
                <InputText
                  inputRef={nameInputRef}
                  id="newsletter-name"
                  label="Your Name"
                  required
                />
                <InputText
                  inputRef={emailInputRef}
                  id="newsletter-email"
                  label="Your Email"
                  type="email"
                  required
                />
                <span data-fs-newsletter-addendum>
                  By subscribing to our newsletter you agree to to our{' '}
                  <Link href="/" inverse variant="inline">
                    Privacy Policy.
                  </Link>
                </span>
                <Button variant="secondary" inverse type="submit">
                  {loading ? 'Loading...' : 'Subscribe'}
                </Button>
              </>
            )}
          </div>
        </Form>
      </Section>
    )
  }
)

export default Newsletter
