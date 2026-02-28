# Alert Section (Matter)

## Intention
CMS-configurable alert banner section.

## Description
Alert section for sitewide notifications with CMS configuration.

## Import
```tsx
import Alert from 'src/components/sections/Alert'
```

## CMS Configuration

```tsx
{
  message: { type: 'string' },
  icon: { type: 'string' },
  link: { type: 'link' },
  dismissible: { type: 'boolean', default: true }
}
```

## Examples

```tsx
<Alert
  message="Free shipping on orders over $50"
  icon="Truck"
/>
```
