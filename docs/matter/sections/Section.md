# Section (Matter)

## Intention
Base wrapper for all CMS sections.

## Description
Section provides consistent wrapper for CMS sections with viewport observer, spacing, and metadata.

## Import
```tsx
import Section from 'src/components/sections/Section'
```

## Architecture

```
Section
├── ViewportObserver (lazy loading)
├── CMS metadata
└── Section content
```

## Examples

```tsx
<Section data-section-id="hero-1">
  <Hero {...heroProps} />
</Section>
```
