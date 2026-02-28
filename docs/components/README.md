# Foundational Components

Presentational UI components from `@faststore/components` and `@faststore/ui` packages. These components follow atomic design principles and are framework-agnostic, focusing on UI rendering and user interactions.

## Package Information

- **Package**: `@faststore/components` (logic) + `@faststore/ui` (styles)
- **Location**: `packages/components/` and `packages/ui/`
- **Philosophy**: Separation of concerns - components handle structure, styles are optional

## Component Organization

### [Atoms](./atoms/) (18 components)

Basic building blocks that cannot be broken down further without losing functionality.

| Component | Description | Path |
|-----------|-------------|------|
| [Badge](./atoms/Badge.md) | Status and notification indicator | `atoms/Badge/` |
| [Button](./atoms/Button.md) | Interactive button element | `atoms/Button/` |
| [Checkbox](./atoms/Checkbox.md) | Checkbox input control | `atoms/Checkbox/` |
| [Icon](./atoms/Icon.md) | SVG icon wrapper | `atoms/Icon/` |
| [Input](./atoms/Input.md) | Text input field | `atoms/Input/` |
| [Label](./atoms/Label.md) | Form label element | `atoms/Label/` |
| [Link](./atoms/Link.md) | Hyperlink element | `atoms/Link/` |
| [List](./atoms/List.md) | Ordered or unordered list | `atoms/List/` |
| [Loader](./atoms/Loader.md) | Loading spinner indicator | `atoms/Loader/` |
| [Overlay](./atoms/Overlay.md) | Background overlay for modals | `atoms/Overlay/` |
| [Price](./atoms/Price.md) | Price display formatter | `atoms/Price/` |
| [Radio](./atoms/Radio.md) | Radio button control | `atoms/Radio/` |
| [RichText](./atoms/RichText.md) | Rich text content display | `atoms/RichText/` |
| [Select](./atoms/Select.md) | Dropdown select control | `atoms/Select/` |
| [Skeleton](./atoms/Skeleton.md) | Loading placeholder | `atoms/Skeleton/` |
| [Slider](./atoms/Slider.md) | Range slider control | `atoms/Slider/` |
| [SROnly](./atoms/SROnly.md) | Screen reader only content | `atoms/SROnly/` |
| [Textarea](./atoms/Textarea.md) | Multi-line text input | `atoms/Textarea/` |

### [Molecules](./molecules/) (43 components)

Composed components combining multiple atoms to create functional units.

#### Form Components
| Component | Description |
|-----------|-------------|
| [CheckboxField](./molecules/CheckboxField.md) | Checkbox with label and validation |
| [InputField](./molecules/InputField.md) | Input with label and error messages |
| [RadioField](./molecules/RadioField.md) | Radio button with label |
| [RadioGroup](./molecules/RadioGroup.md) | Group of radio options |
| [RatingField](./molecules/RatingField.md) | Star rating input |
| [SelectField](./molecules/SelectField.md) | Select with label and validation |
| [TextareaField](./molecules/TextareaField.md) | Textarea with label |
| [ToggleField](./molecules/ToggleField.md) | Toggle switch with label |

#### Button Variants
| Component | Description |
|-----------|-------------|
| [BuyButton](./molecules/BuyButton.md) | Add to cart button |
| [IconButton](./molecules/IconButton.md) | Button with icon |
| [LinkButton](./molecules/LinkButton.md) | Button styled as link |

#### Interactive Components
| Component | Description |
|-----------|-------------|
| [Accordion](./molecules/Accordion.md) | Expandable/collapsible content |
| [Alert](./molecules/Alert.md) | Alert notification message |
| [Carousel](./molecules/Carousel.md) | Image/content carousel |
| [Dropdown](./molecules/Dropdown.md) | Dropdown menu component |
| [Modal](./molecules/Modal.md) | Modal dialog overlay |
| [Popover](./molecules/Popover.md) | Contextual popover |
| [Toast](./molecules/Toast.md) | Toast notification |
| [Tooltip](./molecules/Tooltip.md) | Hover tooltip |
| [Toggle](./molecules/Toggle.md) | Toggle switch |

#### Product Components
| Component | Description |
|-----------|-------------|
| [ProductCard](./molecules/ProductCard.md) | Product display card |
| [ProductPrice](./molecules/ProductPrice.md) | Product price display |
| [ProductTitle](./molecules/ProductTitle.md) | Product title/name |
| [DiscountBadge](./molecules/DiscountBadge.md) | Discount percentage badge |
| [QuantitySelector](./molecules/QuantitySelector.md) | Quantity increment/decrement |
| [SkuSelector](./molecules/SkuSelector.md) | SKU variant selector |
| [Rating](./molecules/Rating.md) | Star rating display |

#### Cart & Order
| Component | Description |
|-----------|-------------|
| [CartItem](./molecules/CartItem.md) | Shopping cart line item |
| [OrderSummary](./molecules/OrderSummary.md) | Order total summary |
| [Gift](./molecules/Gift.md) | Gift item display |

#### Navigation
| Component | Description |
|-----------|-------------|
| [Breadcrumb](./molecules/Breadcrumb.md) | Breadcrumb navigation |
| [NavbarLinks](./molecules/NavbarLinks.md) | Navigation link list |
| [RegionBar](./molecules/RegionBar.md) | Region selector bar |

#### Search Components
| Component | Description |
|-----------|-------------|
| [SearchAutoComplete](./molecules/SearchAutoComplete.md) | Search autocomplete suggestions |
| [SearchDropdown](./molecules/SearchDropdown.md) | Search results dropdown |
| [SearchHistory](./molecules/SearchHistory.md) | Recent searches |
| [SearchInputField](./molecules/SearchInputField.md) | Search input with icon |
| [SearchProducts](./molecules/SearchProducts.md) | Search product results |
| [SearchProvider](./molecules/SearchProvider.md) | Search context provider |
| [SearchTop](./molecules/SearchTop.md) | Top search results |

#### Display Components
| Component | Description |
|-----------|-------------|
| [Card](./molecules/Card.md) | Generic content card |
| [Table](./molecules/Table.md) | Data table |
| [Tag](./molecules/Tag.md) | Label tag |

### [Organisms](./organisms/) (20 components)

Complex feature-level components composed of multiple molecules and atoms.

| Component | Description | Path |
|-----------|-------------|------|
| [BannerText](./organisms/BannerText.md) | Text banner with CTA | `organisms/BannerText/` |
| [CartSidebar](./organisms/CartSidebar.md) | Shopping cart sidebar | `organisms/CartSidebar/` |
| [EmptyState](./organisms/EmptyState.md) | Empty state placeholder | `organisms/EmptyState/` |
| [Filter](./organisms/Filter.md) | Product filtering UI | `organisms/Filter/` |
| [Hero](./organisms/Hero.md) | Hero banner section | `organisms/Hero/` |
| [ImageGallery](./organisms/ImageGallery.md) | Product image gallery | `organisms/ImageGallery/` |
| [Navbar](./organisms/Navbar.md) | Main navigation bar | `organisms/Navbar/` |
| [NavbarSlider](./organisms/NavbarSlider.md) | Mobile navigation slider | `organisms/NavbarSlider/` |
| [Newsletter](./organisms/Newsletter.md) | Newsletter signup form | `organisms/Newsletter/` |
| [OutOfStock](./organisms/OutOfStock.md) | Out of stock notification | `organisms/OutOfStock/` |
| [PaymentMethods](./organisms/PaymentMethods.md) | Payment method selector | `organisms/PaymentMethods/` |
| [PriceRange](./organisms/PriceRange.md) | Price range filter | `organisms/PriceRange/` |
| [ProductComparison](./organisms/ProductComparison.md) | Product comparison tool | `organisms/ProductComparison/` |
| [ProductGrid](./organisms/ProductGrid.md) | Product grid layout | `organisms/ProductGrid/` |
| [ProductShelf](./organisms/ProductShelf.md) | Product carousel/shelf | `organisms/ProductShelf/` |
| [RegionModal](./organisms/RegionModal.md) | Region selection modal | `organisms/RegionModal/` |
| [SearchInput](./organisms/SearchInput.md) | Main search interface | `organisms/SearchInput/` |
| [ShippingSimulation](./organisms/ShippingSimulation.md) | Shipping calculator | `organisms/ShippingSimulation/` |
| [SKUMatrix](./organisms/SKUMatrix.md) | SKU matrix selector | `organisms/SKUMatrix/` |
| [SlideOver](./organisms/SlideOver.md) | Slide-over panel | `organisms/SlideOver/` |

## Installation

```bash
# Install components (unstyled)
npm install @faststore/components

# Install UI components (with styles)
npm install @faststore/ui
```

## Usage

```tsx
// Import unstyled components
import { Button } from '@faststore/components'

// Import styled components
import { Button } from '@faststore/ui'
```

## Styling Approach

Components expose CSS custom properties (design tokens) for customization:

```scss
[data-fs-button] {
  --fs-button-padding: var(--fs-spacing-2);
  --fs-button-border-radius: var(--fs-border-radius);
  --fs-button-background-color: var(--fs-color-primary);
}
```

## Accessibility

All components follow WCAG 2.1 AA guidelines:
- Semantic HTML elements
- ARIA attributes where appropriate
- Keyboard navigation support
- Screen reader compatibility
- Focus management

## Data Attributes

Components use `data-fs-*` attributes for styling hooks:

```tsx
<button data-fs-button data-fs-button-variant="primary">
  Click me
</button>
```

## Related Documentation

- [Matter Components](../matter/README.md) - Integration layer
- [Design Tokens](https://www.faststore.dev/reference/ui/tokens)
- [Theming Guide](https://www.faststore.dev/docs/themes)
