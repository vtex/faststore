# BannerNewsletter Section (Matter)

## Intention
CMS-configurable newsletter banner combining text and signup.

## Description
Combined banner with promotional text and newsletter form.

## Import
```tsx
import BannerNewsletter from 'src/components/sections/BannerNewsletter'
```

## CMS Configuration

```tsx
{
  title: { type: 'string' },
  description: { type: 'string' },
  backgroundColor: { type: 'color' }
}
```

## Examples

```tsx
<BannerNewsletter
  title="Stay in the loop"
  description="Get exclusive deals"
/>
```
