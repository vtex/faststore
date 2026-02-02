# LandingPage (Matter)

## Intention
Homepage template with CMS sections.

## Description
LandingPage template renders CMS-configured sections for homepage. Includes SEO optimization, viewport observers, and section composition.

## Import
```tsx
import LandingPage from 'src/components/templates/LandingPage'
```

## Architecture

```
LandingPage
├── SEO metadata
├── CMS sections rendering
├── Viewport observers
└── Dynamic section components
```

## CMS Configuration

Sections are configured via CMS and rendered dynamically:
- Hero
- ProductShelf
- BannerText
- Newsletter
- Incentives
- Custom sections

## Examples

```tsx
<LandingPage sections={cmsSections} />
```
