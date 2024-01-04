import React from 'react'
import {
  Icon,
  InputField,
  Button,
  Newsletter,
  NewsletterAddendum,
  NewsletterContent,
  NewsletterForm,
  NewsletterHeader,
} from '@faststore/ui'

function NewsletterUsage({
  card = false,
  colorVariant = 'main',
}: {
  card: boolean
  colorVariant: 'main' | 'light' | 'accent'
}) {
  return (
    <Newsletter card={card} colorVariant={colorVariant}>
      <NewsletterForm onSubmit={() => null}>
        <NewsletterHeader
          icon={<Icon name="Envelope" />}
          title="Get News and Special Offers!"
          description="Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here."
        />
        <NewsletterContent>
          <InputField id="newsletter-name" required label="Name" />
          <InputField
            id="newsletter-email"
            type="email"
            required
            label="Email"
          />
          <NewsletterAddendum addendum="By subscribing to our newsletter you agree to to our Privacy Policy." />
          <Button
            variant="secondary"
            type="submit"
            inverse={colorVariant === 'main'}
          >
            Subscribe
          </Button>
        </NewsletterContent>
      </NewsletterForm>
    </Newsletter>
  )
}

export default NewsletterUsage
