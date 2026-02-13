# RegionBar Section (Matter)

## Intention
CMS-configurable region selector section.

## Description
RegionBar section for sitewide region selection with CMS settings.

## Import
```tsx
import RegionBar from 'src/components/sections/RegionBar'
```

## CMS Configuration

```tsx
{
  showIcon: { type: 'boolean', default: true },
  defaultLabel: { type: 'string', default: 'Set your location' }
}
```

## Examples

```tsx
<RegionBar />
```
