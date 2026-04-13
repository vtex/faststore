---
name: faststore-atomic-ui
description: FastStore atomic design system including @faststore/components and @faststore/ui packages, available atoms, molecules, and organisms, and their data-fs-* styling attributes. Use when composing new components with FastStore UI building blocks, looking up which UI components are available (Button, InputField, Modal, ProductCard, etc.), or finding the correct data-fs-* attribute to target for SCSS customization.
metadata:
  author: vtex
  version: "1.0"
---

# FastStore Atomic Design System

FastStore uses an atomic design system with two packages:

- **`@faststore/components`** — React component implementations without default styles. Components expose `data-fs-*` attributes for styling hooks.
- **`@faststore/ui`** — Re-exports `@faststore/components` and provides SCSS stylesheets. Importing `@faststore/ui` styles adds styling to the components.

`@faststore/ui` uses `data-fs-*` attributes defined by `@faststore/components` in its SCSS to style specific components, avoiding style rule conflicts.

## Always use `@faststore/ui` for composition

When building override components or new sections, always compose with `@faststore/ui` atoms and molecules:

```tsx
import {
  Button as UIButton,
  InputField as UIInputField,
  Textarea as UITextArea,
  Modal as UIModal,
  Badge as UIBadge,
} from "@faststore/ui";
```

## How Styling Works

Components declare `data-fs-*` attributes on their DOM elements, and `@faststore/ui` targets those in SCSS:

```tsx
// Badge component renders:
<div data-fs-badge data-fs-badge-variant="neutral" data-fs-badge-size="small">
  <div data-fs-badge-wrapper>{children}</div>
</div>
```

```scss
// @faststore/ui targets it with:
[data-fs-badge] { /* badge styles */ }
[data-fs-badge][data-fs-badge-variant="neutral"] { /* variant styles */ }
```

You can target these same attributes in your `.module.scss` files to customize components:

```scss
.mySection {
  [data-fs-badge][data-fs-badge-variant="neutral"] {
    background-color: var(--fs-color-primary-bkg);
  }
}
```

## Available Components by Category

### Atoms
`Badge`, `Button`, `Checkbox`, `Icon`, `Input`, `Label`, `Link`, `List`, `Loader`, `Overlay`, `Price`, `Radio`, `RichText`, `Select`, `Skeleton`, `Slider`, `SROnly`, `Textarea`

### Molecules
`Accordion`, `Alert`, `Breadcrumb`, `BuyButton`, `Card`, `Carousel`, `CartItem`, `CheckboxField`, `DiscountBadge`, `Dropdown`, `Gift`, `IconButton`, `InputField`, `LinkButton`, `Modal`, `NavbarLinks`, `OrderSummary`, `Popover`, `ProductCard`, `ProductPrice`, `ProductTitle`, `QuantitySelector`, `RadioField`, `RadioGroup`, `Rating`, `RatingField`, `RegionBar`, `SearchAutoComplete`, `SearchDropdown`, `SearchHistory`, `SearchInputField`, `SearchProducts`, `SearchTop`, `SelectField`, `SkuSelector`, `Table`, `Tag`, `TextareaField`, `Toast`, `Toggle`, `ToggleField`, `Tooltip`

### Organisms
`BannerText`, `CartSidebar`, `EmptyState`, `Filter`, `Hero`, `ImageGallery`, `Navbar`, `NavbarSlider`, `Newsletter`, `OutOfStock`, `PaymentMethods`, `PriceRange`, `ProductComparison`, `ProductGrid`, `ProductShelf`, `RegionModal`, `SearchInput`, `ShippingSimulation`, `SKUMatrix`, `SlideOver`

## Full `data-fs-*` Attribute Reference

See [references/REFERENCE.md](references/REFERENCE.md) for the complete list of all `data-fs-*` styling attributes organized by atom, molecule, and organism.

## Example — Composing a Custom Component

```tsx
import {
  Button as UIButton,
  InputField as UIInputField,
} from "@faststore/ui";
import styles from "./my-component.module.scss";

export function MyCustomForm() {
  return (
    <div className={styles.wrapper}>
      <UIInputField id="email" label="Email" />
      <UIButton variant="primary" type="submit">
        Subscribe
      </UIButton>
    </div>
  );
}
```

```scss
// my-component.module.scss
.wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--fs-spacing-3);

  // Customize the Button inside this component
  [data-fs-button][data-fs-button-variant="primary"] {
    border-radius: var(--fs-border-radius-pill);
  }
}
```
# Faststore design system.

Faststore uses a ATOMIC design system that can be used by user to compose new components and no need of reimplement features or ensure correct HTML Semantic for search engines.

Therer is two packages: 
    - @faststore/components: Design system react component implementation without estyling.
    - @faststore/ui: Re-exports @faststore/components and also provides sass stylesheets that when imported adds styles to the components.

The `@faststore/ui` uses `data-*` attributes defined by `@faststore/components` in its stylesheet to style specific components without worring about style rules crash override.

Example:
 ```tsx
  // Badge component at @faststore/components

    const Badge = forwardRef<HTMLDivElement, BadgeProps>(function Badge(
    {
        testId = 'fs-badge',
        size = 'small',
        variant = 'neutral',
        counter = false,
        'aria-label': ariaLabel,
        children,
        ...otherProps
    }: BadgeProps,
    ref
    ) {
    return (
        <div
        ref={ref}
        data-fs-badge
        aria-label={ariaLabel}
        data-fs-badge-variant={counter ? null : variant}
        data-fs-badge-size={size}
        data-fs-badge-counter={counter}
        data-testid={testId}
        {...otherProps}
        >
        <div data-fs-badge-wrapper>{children}</div>
        </div>
    )
    })

    export default Badge

```

```sass
<!-- Badge styling under @faststore/ui -->
    [data-fs-badge] {
        <!-- Badge rules... -->
    }
```

---

# `@faststore/components` data attributes reference

This file lists styling hooks used by `@faststore/ui` (primarily `data-fs-*`).

## Atoms

- `Badge`: `data-fs-badge`, `data-fs-badge-counter`, `data-fs-badge-size`, `data-fs-badge-variant`, `data-fs-badge-wrapper`
- `Button`: `data-fs-button`, `data-fs-button-icon`, `data-fs-button-inverse`, `data-fs-button-loading`, `data-fs-button-loading-label`, `data-fs-button-size`, `data-fs-button-variant`, `data-fs-button-wrapper`
- `Checkbox`: `data-fs-checkbox`, `data-fs-checkbox-partial`
- `Icon`: `data-fs-icon`
- `Input`: `data-fs-input`
- `Label`: `data-fs-label`
- `Link`: `data-fs-link`, `data-fs-link-inverse`, `data-fs-link-size`, `data-fs-link-variant`
- `List`: `data-fs-list`, `data-fs-list-marker`
- `Loader`: `data-fs-loader`, `data-fs-loader-item`, `data-fs-loader-variant`
- `Overlay`: `data-fs-overlay`
- `Price`: `data-fs-price`, `data-fs-price-variant`
- `Radio`: `data-fs-radio`
- `RichText`: `data-fs-rich-text`
- `Select`: `data-fs-select`, `data-fs-select-icon`
- `Skeleton`: `data-fs-skeleton`, `data-fs-skeleton-border`, `data-fs-skeleton-shimmer`
- `Slider`: `data-fs-slider`, `data-fs-slider-absolute-values`, `data-fs-slider-range`, `data-fs-slider-thumb`, `data-fs-slider-value-label`, `data-fs-slider-wrapper`
- `SROnly`: `data-fs-sr-only`
- `Textarea`: `data-fs-textarea`, `data-fs-textarea-resize`

## Molecules

- `Accordion`: `data-fs-accordion`, `data-fs-accordion-button`, `data-fs-accordion-item`, `data-fs-accordion-panel`
- `Alert`: `data-fs-alert`, `data-fs-alert-button`, `data-fs-alert-content`, `data-fs-alert-dismissible`, `data-fs-alert-link`, `data-fs-content`
- `Breadcrumb`: `data-fs-breadcrumb`, `data-fs-breadcrumb-divider`, `data-fs-breadcrumb-dropdown-button`, `data-fs-breadcrumb-dropdown-item`, `data-fs-breadcrumb-dropdown-link`, `data-fs-breadcrumb-dropdown-menu`, `data-fs-breadcrumb-is-desktop`, `data-fs-breadcrumb-item`, `data-fs-breadcrumb-link`, `data-fs-breadcrumb-list`, `data-fs-breadcrumb-list-item`, `data-fs-content`, `data-fs-dropdown-item-icon`
- `BuyButton`: `data-fs-buy-button`
- `Card`: `data-fs-card`, `data-fs-card-body`, `data-fs-card-header`, `data-fs-card-title`
- `Carousel`: `data-fs-carousel`, `data-fs-carousel-bullet`, `data-fs-carousel-bullets`, `data-fs-carousel-control`, `data-fs-carousel-controls`, `data-fs-carousel-item`, `data-fs-carousel-item-visible`, `data-fs-carousel-track`, `data-fs-carousel-track-container`, `data-fs-carousel-variant`
- `CartItem`: `data-fs-cart-item`, `data-fs-cart-item-actions`, `data-fs-cart-item-content`, `data-fs-cart-item-image`, `data-fs-cart-item-prices`, `data-fs-cart-item-remove-button`, `data-fs-cart-item-skus`, `data-fs-cart-item-summary`, `data-fs-cart-item-title`
- `CheckboxField`: `data-fs-checkbox-field`, `data-fs-checkbox-field-alignment`, `data-fs-checkbox-field-content`, `data-fs-checkbox-field-error`, `data-fs-checkbox-field-error-message`, `data-fs-checkbox-field-label`
- `DiscountBadge`: `data-fs-discount-badge`, `data-fs-discount-badge-variant`
- `Dropdown`: `data-fs-dropdown-button`, `data-fs-dropdown-item`, `data-fs-dropdown-menu`, `data-fs-dropdown-menu-size`, `data-fs-dropdown-overlay`
- `Gift`: `data-fs-gift`, `data-fs-gift-content`, `data-fs-gift-icon`, `data-fs-gift-image`, `data-fs-gift-product-summary`, `data-fs-gift-product-title`, `data-fs-gift-wrapper`
- `IconButton`: `data-fs-button`, `data-fs-icon-button`
- `InputField`: `data-fs-input-field`, `data-fs-input-field-actionable`, `data-fs-input-field-error`, `data-fs-input-field-error-message`
- `LinkButton`: `data-fs-button`, `data-fs-button-disabled`, `data-fs-button-icon`, `data-fs-button-inverse`, `data-fs-button-size`, `data-fs-button-variant`, `data-fs-button-wrapper`, `data-fs-link-button`
- `Modal`: `data-fs-modal`, `data-fs-modal-body`, `data-fs-modal-content`, `data-fs-modal-footer`, `data-fs-modal-footer-actions`, `data-fs-modal-footer-actions-direction`, `data-fs-modal-footer-actions-wrap`, `data-fs-modal-header`, `data-fs-modal-header-close-button`, `data-fs-modal-header-description`, `data-fs-modal-header-title`, `data-fs-modal-state`
- `NavbarLinks`: `data-fs-navbar-links`, `data-fs-navbar-links-list`, `data-fs-navbar-links-list-item`
- `OrderSummary`: `data-fs-order-summary`, `data-fs-order-summary-discount`, `data-fs-order-summary-discount-label`, `data-fs-order-summary-discount-value`, `data-fs-order-summary-subtotal`, `data-fs-order-summary-subtotal-label`, `data-fs-order-summary-subtotal-value`, `data-fs-order-summary-taxes-label`, `data-fs-order-summary-total`, `data-fs-order-summary-total-label`, `data-fs-order-summary-total-value`
- `Popover`: `data-fs-popover`, `data-fs-popover-content`, `data-fs-popover-header`, `data-fs-popover-header-dismiss-button`, `data-fs-popover-header-title`, `data-fs-popover-indicator`, `data-fs-popover-placement`
- `ProductCard`: `data-fs-product-card`, `data-fs-product-card-actions`, `data-fs-product-card-badge`, `data-fs-product-card-bordered`, `data-fs-product-card-content`, `data-fs-product-card-delivery-promise-badge`, `data-fs-product-card-delivery-promise-badge-availability`, `data-fs-product-card-delivery-promise-badges`, `data-fs-product-card-heading`, `data-fs-product-card-image`, `data-fs-product-card-prices`, `data-fs-product-card-sponsored-label`, `data-fs-product-card-taxes-label`, `data-fs-product-card-title`, `data-fs-product-card-variant`
- `ProductPrice`: `data-fs-product-price`
- `ProductTitle`: `data-fs-product-title`, `data-fs-product-title-addendum`, `data-fs-product-title-header`
- `QuantitySelector`: `data-fs-quantity-selector`
- `RadioField`: `data-fs-radio-field`
- `RadioGroup`: `data-fs-radio-group-option`, `data-fs-radio-option-item`
- `Rating`: `data-fs-rating`, `data-fs-rating-actionable`, `data-fs-rating-button`, `data-fs-rating-icon-outline`, `data-fs-rating-icon-wrapper`, `data-fs-rating-item`
- `RatingField`: `data-fs-rating-field`, `data-fs-rating-field-disabled`, `data-fs-rating-field-error`, `data-fs-rating-field-error-message`, `data-fs-rating-field-input`, `data-fs-rating-field-label`
- `RegionBar`: `data-fs-region-bar`, `data-fs-region-bar-filter`, `data-fs-region-bar-filter-message`, `data-fs-region-bar-location`, `data-fs-region-bar-location-city`, `data-fs-region-bar-location-message`, `data-fs-region-bar-location-postal-code`, `data-fs-region-bar-message`, `data-fs-region-bar-postal-code`
- `SearchAutoComplete`: `data-fs-search-auto-complete`, `data-fs-search-auto-complete-item`, `data-fs-search-auto-complete-item-icon`, `data-fs-search-auto-complete-item-link`, `data-fs-search-auto-complete-item-suggestion`
- `SearchDropdown`: `data-fs-search-dropdown`, `data-fs-search-dropdown-loading-text`
- `SearchHistory`: `data-fs-search-history`, `data-fs-search-history-header`, `data-fs-search-history-item`, `data-fs-search-history-item-icon`, `data-fs-search-history-item-link`, `data-fs-search-history-title`
- `SearchInputField`: `data-fs-search-input-field`, `data-fs-search-input-field-input`
- `SearchProducts`: `data-fs-product-item-control-input`, `data-fs-search-product-item`, `data-fs-search-product-item-content`, `data-fs-search-product-item-control`, `data-fs-search-product-item-control-actions`, `data-fs-search-product-item-control-actions-desktop`, `data-fs-search-product-item-control-actions-mobile`, `data-fs-search-product-item-control-badge`, `data-fs-search-product-item-control-content`, `data-fs-search-product-item-image`, `data-fs-search-product-item-link`, `data-fs-search-product-item-prices`, `data-fs-search-product-item-title`, `data-fs-search-products`, `data-fs-search-products-header`, `data-fs-search-products-title`
- `SearchProvider`: none
- `SearchTop`: `data-fs-search-top`, `data-fs-search-top-header`, `data-fs-search-top-item`, `data-fs-search-top-item-badge`, `data-fs-search-top-item-link`, `data-fs-search-top-title`
- `SelectField`: `data-fs-select-field`, `data-fs-select-field-label`
- `SkuSelector`: `data-fs-sku-selector`, `data-fs-sku-selector-checked`, `data-fs-sku-selector-disabled`, `data-fs-sku-selector-list`, `data-fs-sku-selector-option`, `data-fs-sku-selector-option-color`, `data-fs-sku-selector-option-image`, `data-fs-sku-selector-option-link`, `data-fs-sku-selector-title`, `data-fs-sku-selector-variant`
- `Table`: `data-fs-table`, `data-fs-table-body`, `data-fs-table-cell`, `data-fs-table-cell-align`, `data-fs-table-content`, `data-fs-table-footer`, `data-fs-table-head`, `data-fs-table-row`, `data-fs-table-variant`
- `Tag`: `data-fs-tag`, `data-fs-tag-icon-button`, `data-fs-tag-label`
- `TextareaField`: `data-fs-textarea-field`, `data-fs-textarea-field-error`, `data-fs-textarea-field-error-message`, `data-fs-textarea-field-label`
- `Toast`: `data-fs-toast`, `data-fs-toast-content`, `data-fs-toast-icon-container`, `data-fs-toast-message`, `data-fs-toast-title`, `data-fs-toast-visible`
- `Toggle`: `data-fs-toggle`, `data-fs-toggle-knob`, `data-fs-toggle-variant`
- `ToggleField`: `data-fs-toggle-field`, `data-fs-toggle-field-label`
- `Tooltip`: `data-fs-tooltip`, `data-fs-tooltip-content`, `data-fs-tooltip-dismiss-button`, `data-fs-tooltip-dismissible`, `data-fs-tooltip-indicator`, `data-fs-tooltip-placement`, `data-fs-tooltip-wrapper`

## Organisms

- `BannerText`: `data-fs-banner-text`, `data-fs-banner-text-color-variant`, `data-fs-banner-text-content`, `data-fs-banner-text-heading`, `data-fs-banner-text-link`, `data-fs-banner-text-variant`, `data-fs-content`
- `CartSidebar`: `data-fs-cart-sidebar`, `data-fs-cart-sidebar-footer`, `data-fs-cart-sidebar-list`, `data-fs-cart-sidebar-title`
- `EmptyState`: `data-fs-content`, `data-fs-empty-state`, `data-fs-empty-state-bkg-color`, `data-fs-empty-state-title`, `data-fs-empty-state-variant`
- `Filter`: `data-fs-filter`, `data-fs-filter-accordion`, `data-fs-filter-accordion-item`, `data-fs-filter-accordion-item-description`, `data-fs-filter-facet-range`, `data-fs-filter-list`, `data-fs-filter-list-item`, `data-fs-filter-list-item-badge`, `data-fs-filter-list-item-checkbox`, `data-fs-filter-list-item-label`, `data-fs-filter-list-item-radio`, `data-fs-filter-slider`, `data-fs-filter-slider-content`, `data-fs-filter-slider-footer`, `data-fs-filter-slider-footer-button-apply`, `data-fs-filter-slider-footer-button-clear`, `data-fs-filter-slider-title`, `data-fs-filter-title`
- `Hero`: `data-fs-content`, `data-fs-hero`, `data-fs-hero-color-variant`, `data-fs-hero-heading`, `data-fs-hero-icon`, `data-fs-hero-image`, `data-fs-hero-info`, `data-fs-hero-subtitle`, `data-fs-hero-title`, `data-fs-hero-variant`, `data-fs-hero-wrapper`
- `ImageGallery`: `data-fs-image-gallery`, `data-fs-image-gallery-selector`, `data-fs-image-gallery-selector-control`, `data-fs-image-gallery-selector-control-button`, `data-fs-image-gallery-selector-elements`, `data-fs-image-gallery-selector-thumbnail`
- `Navbar`: `data-fs-content`, `data-fs-navbar`, `data-fs-navbar-buttons`, `data-fs-navbar-header`, `data-fs-navbar-row`, `data-fs-navbar-scroll`, `data-fs-navbar-search-expanded`
- `NavbarSlider`: `data-fs-navbar-slider`, `data-fs-navbar-slider-content`, `data-fs-navbar-slider-footer`, `data-fs-navbar-slider-header`
- `Newsletter`: `data-fs-content`, `data-fs-newsletter`, `data-fs-newsletter-addendum`, `data-fs-newsletter-color-variant`, `data-fs-newsletter-content`, `data-fs-newsletter-form`, `data-fs-newsletter-header`, `data-fs-newsletter-header-description`, `data-fs-newsletter-header-title`
- `OutOfStock`: `data-fs-out-of-stock`, `data-fs-out-of-stock-button`, `data-fs-out-of-stock-message`, `data-fs-out-of-stock-title`
- `PaymentMethods`: `data-fs-payment-methods`, `data-fs-payment-methods-flag`, `data-fs-payment-methods-flags`, `data-fs-payment-methods-title`
- `PriceRange`: `data-fs-price-range`, `data-fs-price-range-inputs`
- `ProductComparison`: `data-fs-dropdown-filter-selected`, `data-fs-product-comparison-container`, `data-fs-product-comparison-dropdown-button`, `data-fs-product-comparison-dropdown-item-filter-type`, `data-fs-product-comparison-dropdown-item-filter-type-text`, `data-fs-product-comparison-dropdown-menu-content`, `data-fs-product-comparison-filters`, `data-fs-product-comparison-filters-sort-label`, `data-fs-product-comparison-row-header`, `data-fs-product-comparison-row-header-button`, `data-fs-product-comparison-row-header-button-description`, `data-fs-product-comparison-row-header-button-title`, `data-fs-product-comparison-row-label`, `data-fs-product-comparison-row-text`, `data-fs-product-comparison-selection-warning-label`, `data-fs-product-comparison-sidebar`, `data-fs-product-comparison-sidebar-header-title`, `data-fs-product-comparison-toggle-field-mobile`, `data-fs-product-comparison-toolbar`, `data-fs-product-comparison-toolbar-image`, `data-fs-product-comparison-toolbar-image-more`, `data-fs-product-comparison-trigger`, `data-fs-product-comparison-trigger-checkbox-field`
- `ProductGrid`: `data-fs-product-grid`, `data-fs-product-grid-item`
- `ProductShelf`: `data-fs-content`, `data-fs-product-shelf`, `data-fs-product-shelf-item`, `data-fs-product-shelf-items`
- `RegionModal`: `data-fs-region-modal`, `data-fs-region-modal-input`, `data-fs-region-modal-link`
- `SearchInput`: `data-fs-search-input`, `data-fs-search-input-dropdown-visible`
- `ShippingSimulation`: `data-fs-shipping-simulation`, `data-fs-shipping-simulation-empty`, `data-fs-shipping-simulation-header`, `data-fs-shipping-simulation-link`, `data-fs-shipping-simulation-location`, `data-fs-shipping-simulation-option-carrier`, `data-fs-shipping-simulation-option-estimate`, `data-fs-shipping-simulation-subtitle`, `data-fs-shipping-simulation-title`
- `SKUMatrix`: `data-fs-sku-matrix`, `data-fs-sku-matrix-sidebar`, `data-fs-sku-matrix-sidebar-cell-image`, `data-fs-sku-matrix-sidebar-footer`, `data-fs-sku-matrix-sidebar-table-action`, `data-fs-sku-matrix-sidebar-table-cell-quantity-selector`, `data-fs-sku-matrix-sidebar-table-price`, `data-fs-sku-matrix-sidebar-title`
- `SlideOver`: `data-fs-modal`, `data-fs-slide-over`, `data-fs-slide-over-direction`, `data-fs-slide-over-header`, `data-fs-slide-over-header-icon`, `data-fs-slide-over-size`, `data-fs-slide-over-state`

## Notes

- This reference intentionally excludes non-styling helpers such as `data-testid`.
- A few non `data-fs-*` hooks also exist in code (for example `data-value`, `data-type`, `data-quantity`, `data-icon`, `data-quantity-selector-*`) and may be used for behavior or testing depending on the component.


