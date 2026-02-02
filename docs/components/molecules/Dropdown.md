# Dropdown

## Intention
Menu with clickable options triggered by a button.

## Description
Dropdown displays a menu of options when triggered. Manages open/close state, positioning, and click-outside handling. Use for actions menus, user menus, or option lists.

In ecommerce, used for sort menus, user account menus, bulk actions.

## Import
```tsx
import { Dropdown } from '@faststore/components'
```

## Sub-components
- `DropdownButton` - Trigger button
- `DropdownMenu` - Menu container
- `DropdownItem` - Individual menu item

## Hooks
- `useDropdown` - Context hook
- `useDropdownItem` - Item behavior

## Examples

```tsx
<Dropdown>
  <DropdownButton>
    Sort By <Icon name="CaretDown" />
  </DropdownButton>
  <DropdownMenu>
    <DropdownItem onClick={() => handleSort('price-asc')}>
      Price: Low to High
    </DropdownItem>
    <DropdownItem onClick={() => handleSort('price-desc')}>
      Price: High to Low
    </DropdownItem>
    <DropdownItem onClick={() => handleSort('name')}>
      Name: A-Z
    </DropdownItem>
  </DropdownMenu>
</Dropdown>
```
