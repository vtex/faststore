# Navbar

## Intention
Main site navigation bar with logo, links, search, and cart.

## Description
Navbar provides the primary navigation structure. Contains logo, navigation links, search, account, and cart access. Responsive with mobile menu support.

## Import
```tsx
import { Navbar } from '@faststore/components'
```

## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `scrollDirection` | `string` | - | Yes | Scroll direction for hide/show behavior |

## Sub-components
- `NavbarHeader` - Logo and primary controls
- `NavbarRow` - Navigation rows
- `NavbarButtons` - Action buttons (search, account, cart)

## Examples

```tsx
const scrollDirection = useScrollDirection()

<Navbar scrollDirection={scrollDirection}>
  <NavbarHeader>
    <Logo />
    <NavbarButtons>
      <SearchButton />
      <AccountButton />
      <CartButton />
    </NavbarButtons>
  </NavbarHeader>
  <NavbarRow>
    <NavbarLinks />
  </NavbarRow>
</Navbar>
```
