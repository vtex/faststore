# NavbarLinks

## Intention
Navigation link list for header menu.

## Description
NavbarLinks displays horizontal navigation links in the navbar. Provides structured list of navigation items with proper semantics.

In ecommerce, used for main site navigation in header.

## Import
```tsx
import { NavbarLinks } from '@faststore/components'
```

## Sub-components
- `NavbarLinksList` - Link container
- `NavbarLinksListItem` - Individual link item

## Examples

```tsx
<NavbarLinks>
  <NavbarLinksList>
    <NavbarLinksListItem>
      <Link href="/new">New Arrivals</Link>
    </NavbarLinksListItem>
    <NavbarLinksListItem>
      <Link href="/sale">Sale</Link>
    </NavbarLinksListItem>
    <NavbarLinksListItem>
      <Link href="/categories">Categories</Link>
    </NavbarLinksListItem>
  </NavbarLinksList>
</NavbarLinks>
```
