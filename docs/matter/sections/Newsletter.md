# Newsletter Section (Matter)

## Intention
CMS-configurable newsletter signup section.

## Description
Newsletter section with form submission integration and CMS configuration for title, description, and styling.

## Import
```tsx
import Newsletter from 'src/components/sections/Newsletter'
```

## CMS Configuration

```tsx
{
  title: { type: 'string', default: 'Stay Updated' },
  description: { type: 'string' },
  submitButtonLabel: { type: 'string', default: 'Subscribe' }
}
```

## Extends

[Newsletter (Foundational)](../../components/organisms/Newsletter.md)

## Examples

```tsx
<Newsletter
  title="Get the latest deals"
  onSubmit={handleNewsletterSignup}
/>
```
