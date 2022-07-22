import type { ComponentPropsWithRef, FormEvent, ReactNode } from 'react'
import { forwardRef, useRef } from 'react'
import { Form, Label, Input, LoadingButton } from '@faststore/ui'

import { useNewsletter } from 'src/sdk/newsletter/useNewsletter'

import Section from '../Section'

export interface NewsletterProps
  extends Omit<ComponentPropsWithRef<'form'>, 'title' | 'onSubmit'> {
  /**
   * Title for the section.
   */
  title: ReactNode
  /**
   * A subtitle for the section.
   */
  subtitle?: ReactNode
}

const Newsletter = forwardRef<HTMLFormElement, NewsletterProps>(
  function Newsletter({ title, subtitle, ...otherProps }, ref) {
    const { subscribeUser, loading } = useNewsletter()
    const nameInputRef = useRef<HTMLInputElement>(null)
    const emailInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault()
      subscribeUser({
        data: {
          name: nameInputRef.current?.value ?? '',
          email: emailInputRef.current?.value ?? '',
        },
      })
      const formElement = event.currentTarget as HTMLFormElement

      formElement.reset()
    }

    return (
      <Section data-fs-newsletter>
        <Form
          data-fs-newsletter-form
          ref={ref}
          onSubmit={handleSubmit}
          {...otherProps}
        >
          <div data-fs-newsletter-header>
            {title}
            {Boolean(subtitle) && subtitle}
          </div>

          <div data-fs-newsletter-controls>
            <Label htmlFor="newsletter-name">Your name</Label>
            <Input
              id="newsletter-name"
              type="text"
              name="newsletter-name"
              ref={nameInputRef}
              required
            />
            <Label htmlFor="newsletter-email">Your email</Label>
            <Input
              id="newsletter-email"
              type="email"
              name="newsletter-email"
              ref={emailInputRef}
              required
            />
            <LoadingButton type="submit" loading={loading}>
              Subscribe
            </LoadingButton>
          </div>
        </Form>
      </Section>
    )
  }
)

export default Newsletter
