import React from 'react'
import type { ReactNode, FormHTMLAttributes } from 'react'

import Form from '../molecules/Form'

export type VariantFormProps = {
  variantDataAttribute: string
  /**
   * ID to find this component in testing tools (e.g.: cypress,
   * testing-library, and jest).
   */
  testId?: string
  /**
   * The Out of Stock Section's title.
   */
  title: string | ReactNode
  /**
   * Message describing when the user will be notified.
   */
  message?: string | ReactNode
  /**
   *
   */
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
  /**
   *
   */
  children: ReactNode
} & FormHTMLAttributes<HTMLFormElement>

function VariantForm({
  variantDataAttribute,
  testId = `store-${variantDataAttribute}`,
  title,
  message,
  children,
  ...formProps
}: VariantFormProps) {
  const dataAttributeSection = `data-store-${variantDataAttribute}`
  const dataVariant = {} as any

  dataVariant[dataAttributeSection] = true

  return (
    <section
      {...{ [`data-store-${variantDataAttribute}`]: true }}
      data-testid={testId}
      aria-live="polite"
    >
      <Form
        {...{ [`data-store-${variantDataAttribute}-form`]: true }}
        testId="store-out-of-stock-form"
        {...formProps}
      >
        <p
          {...{ [`data-store-${variantDataAttribute}-title`]: true }}
          data-testid="store-out-of-stock-title"
        >
          {title}
        </p>
        {!!message && (
          <p
            {...{ [`data-store-${variantDataAttribute}-message`]: true }}
            data-testid="store-out-of-stock-message"
          >
            {message}
          </p>
        )}
        {children}
      </Form>
    </section>
  )
}

export default VariantForm
