# Newsletter

## Intention
Newsletter subscription form.

## Description
Newsletter provides email subscription interface. Includes heading, description, email input, and submit button. Used for capturing email subscribers.

## Import
```tsx
import { Newsletter } from '@faststore/components'
```

## Sub-components
- `NewsletterHeader` - Title and description
- `NewsletterContent` - Main content area
- `NewsletterForm` - Email form
- `NewsletterAddendum` - Additional text/legal

## Examples

```tsx
<Newsletter>
  <NewsletterHeader
    title="Stay Updated"
    description="Get the latest deals and news"
  />
  <NewsletterForm onSubmit={handleSubscribe}>
    <InputField
      type="email"
      placeholder="Your email"
      required
    />
    <Button type="submit">Subscribe</Button>
  </NewsletterForm>
  <NewsletterAddendum>
    By subscribing you agree to our Privacy Policy
  </NewsletterAddendum>
</Newsletter>
```
