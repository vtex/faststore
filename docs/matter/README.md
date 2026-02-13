# Matter Components

Integration layer components from `@faststore/core` that combine foundational UI components with business logic, data fetching, analytics, and CMS configuration. These components are optimized for FastStore/VTEX ecommerce platforms.

## Package Information

- **Package**: `@faststore/core`
- **Location**: `packages/core/src/components/`
- **Framework**: Next.js
- **Philosophy**: Unify UI with data, analytics, and business logic

## Architecture

Matter components extend foundational components by adding:

- **Data Integration**: GraphQL queries and fragments for product data, cart state, etc.
- **State Management**: SDK hooks for cart, session, search, and analytics
- **Analytics Events**: Automatic tracking of user interactions
- **CMS Configuration**: Schema definitions for content management
- **Next.js Features**: Image optimization, routing, SSR/SSG support

## Component Categories

### [Cart](./cart/) (5 components)

Shopping cart integration with state management and analytics.

| Component | Extends | Description |
|-----------|---------|-------------|
| [CartItem](./cart/CartItem.md) | `@faststore/ui` CartItem | Cart line item with quantity management |
| [CartSidebar](./cart/CartSidebar.md) | `@faststore/ui` CartSidebar | Slide-out cart with checkout |
| [CartToggle](./cart/CartToggle.md) | `@faststore/ui` IconButton | Cart icon with item count |
| [EmptyCart](./cart/EmptyCart.md) | `@faststore/ui` EmptyState | Empty cart state |
| [OrderSummary](./cart/OrderSummary.md) | `@faststore/ui` OrderSummary | Order totals with discounts |

**Key Features**: Cart store integration, add/remove analytics, quantity updates, checkout flow

### [Navigation](./navigation/) (3 components)

Site navigation with routing and region awareness.

| Component | Extends | Description |
|-----------|---------|-------------|
| [Navbar](./navigation/Navbar.md) | `@faststore/ui` Navbar | Main navigation bar with Next.js Link |
| [NavbarLinks](./navigation/NavbarLinks.md) | `@faststore/ui` NavbarLinks | Navigation link menu |
| [NavbarSlider](./navigation/NavbarSlider.md) | `@faststore/ui` NavbarSlider | Mobile navigation drawer |

**Key Features**: Next.js routing, scroll behavior, responsive navigation

### [Product](./product/) (4 components)

Product display components with GraphQL data integration.

| Component | Extends | Description |
|-----------|---------|-------------|
| [ProductCard](./product/ProductCard.md) | `@faststore/ui` ProductCard | Product card with data fragment |
| [ProductGrid](./product/ProductGrid.md) | `@faststore/ui` ProductGrid | Responsive product grid |
| [NotAvailableButton](./product/NotAvailableButton.md) | `@faststore/ui` Button | Out of stock button |
| [OutOfStock](./product/OutOfStock.md) | `@faststore/ui` OutOfStock | Out of stock display |

**Key Features**: Product data fragments, price formatting, delivery promise, view_item events

### [Region](./region/) (6 components)

Location and region selection with session management.

| Component | Extends | Description |
|-----------|---------|-------------|
| [RegionBar](./region/RegionBar.md) | `@faststore/ui` RegionBar | Region selector bar |
| [RegionButton](./region/RegionButton.md) | `@faststore/ui` Button | Region selection button |
| [RegionFilterButton](./region/RegionFilterButton.md) | `@faststore/ui` Button | Filter by region |
| [RegionModal](./region/RegionModal.md) | `@faststore/ui` RegionModal | Region selection modal |
| [RegionPopover](./region/RegionPopover.md) | `@faststore/ui` Popover | Region popover selector |
| [RegionSlider](./region/RegionSlider.md) | `@faststore/ui` SlideOver | Mobile region slider |

**Key Features**: Session store integration, postal code validation, shipping regions

### [Search](./search/) (9 components)

Search functionality with suggestions, history, and filtering.

| Component | Extends | Description |
|-----------|---------|-------------|
| [FilterDesktop](./search/FilterDesktop.md) | `@faststore/ui` Filter | Desktop filter panel |
| [FilterSlider](./search/FilterSlider.md) | `@faststore/ui` Filter | Mobile filter slider |
| [FilterDeliveryMethodFacet](./search/FilterDeliveryMethodFacet.md) | Custom | Delivery method filter |
| [SearchDropdown](./search/SearchDropdown.md) | `@faststore/ui` SearchDropdown | Search suggestions dropdown |
| [SearchHistory](./search/SearchHistory.md) | `@faststore/ui` SearchHistory | Recent searches |
| [SearchInput](./search/SearchInput.md) | `@faststore/ui` SearchInput | Search input with routing |
| [SearchProductItem](./search/SearchProductItem.md) | `@faststore/ui` SearchProducts | Search result item |
| [SearchTop](./search/SearchTop.md) | `@faststore/ui` SearchTop | Top search terms |
| [Sort](./search/Sort.md) | `@faststore/ui` Select | Sort dropdown |

**Key Features**: Search SDK integration, suggestion queries, search analytics, filter state

### [Sections](./sections/) (18 components)

CMS-configurable page sections for content management.

| Component | CMS | Description |
|-----------|-----|-------------|
| [Alert](./sections/Alert.md) | ✅ | Alert banner section |
| [BannerNewsletter](./sections/BannerNewsletter.md) | ✅ | Newsletter banner |
| [BannerText](./sections/BannerText.md) | ✅ | Text banner with CTA |
| [Breadcrumb](./sections/Breadcrumb.md) | ✅ | Breadcrumb navigation |
| [CrossSellingShelf](./sections/CrossSellingShelf.md) | ✅ | Related products shelf |
| [EmptyState](./sections/EmptyState.md) | ✅ | Empty state section |
| [Footer](./sections/Footer.md) | ✅ | Site footer |
| [Hero](./sections/Hero.md) | ✅ | Hero banner |
| [Incentives](./sections/Incentives.md) | ✅ | Benefits/incentives bar |
| [Navbar](./sections/Navbar.md) | ✅ | Navigation bar section |
| [Newsletter](./sections/Newsletter.md) | ✅ | Newsletter signup |
| [ProductDetails](./sections/ProductDetails.md) | ✅ | PDP main content |
| [ProductGallery](./sections/ProductGallery.md) | ✅ | PLP product listing |
| [ProductShelf](./sections/ProductShelf.md) | ✅ | Product carousel |
| [ProductTiles](./sections/ProductTiles.md) | ✅ | Product tiles grid |
| [RegionBar](./sections/RegionBar.md) | ✅ | Region selector |
| [ScrollToTopButton](./sections/ScrollToTopButton.md) | ✅ | Scroll to top FAB |
| [Section](./sections/Section.md) | ✅ | Base section wrapper |

**Key Features**: CMS schema, content management, viewport observer, data fetching

### [Templates](./templates/) (3 components)

Full page templates combining multiple sections.

| Component | Description |
|-----------|-------------|
| [LandingPage](./templates/LandingPage.md) | Homepage/landing page template |
| [ProductListingPage](./templates/ProductListingPage.md) | Category/collection page |
| [SearchPage](./templates/SearchPage.md) | Search results page |

**Key Features**: SEO optimization, server-side rendering, page-level data fetching

### [UI Wrappers](./ui/) (20 components)

Next.js-integrated UI components with optimizations.

| Component | Extends | Next.js Feature |
|-----------|---------|-----------------|
| [Image](./ui/Image.md) | `@faststore/ui` + next/image | Image optimization |
| [Link](./ui/Link.md) | `@faststore/ui` + next/link | Client-side routing |
| [Breadcrumb](./ui/Breadcrumb.md) | `@faststore/ui` Breadcrumb | Page context routing |
| [ButtonSignIn](./ui/ButtonSignIn.md) | `@faststore/ui` Button | Auth integration |
| [Carousel](./ui/Carousel.md) | `@faststore/ui` Carousel | Performance optimization |
| [Gift](./ui/Gift.md) | `@faststore/ui` Gift | Gift data formatting |
| [ImageGallery](./ui/ImageGallery.md) | `@faststore/ui` ImageGallery | Image optimization |
| [Incentives](./ui/Incentives.md) | `@faststore/ui` + custom | CMS integration |
| [Logo](./ui/Logo.md) | next/image | Brand logo |
| [Newsletter](./ui/Newsletter.md) | `@faststore/ui` Newsletter | Form submission |
| [PickupPointCards](./ui/PickupPointCards.md) | Custom | Pickup points |
| [ProductComparisonSidebar](./ui/ProductComparisonSidebar.md) | `@faststore/ui` ProductComparison | Comparison state |
| [ProductDescription](./ui/ProductDescription.md) | `@faststore/ui` RichText | Product content |
| [ProductDetailsSettings](./ui/ProductDetailsSettings.md) | Multiple | PDP composition |
| [ProductGallery](./ui/ProductGallery.md) | `@faststore/ui` ProductCard | Filter/sort integration |
| [ProductShelf](./ui/ProductShelf.md) | `@faststore/ui` ProductShelf | Data fetching |
| [RichText](./ui/RichText.md) | `@faststore/ui` RichText | CMS content |
| [ShippingSimulation](./ui/ShippingSimulation.md) | `@faststore/ui` ShippingSimulation | Shipping API |
| [SKUMatrixSidebar](./ui/SKUMatrixSidebar.md) | `@faststore/ui` SKUMatrix | Matrix state |
| [SkuSelector](./ui/SkuSelector.md) | `@faststore/ui` SkuSelector | Variant selection |
| [Tiles](./ui/Tiles.md) | Custom | Tile grid layout |

**Key Features**: Next.js Image, Next.js Link, performance optimization, lazy loading

## Usage

```tsx
// Import from core components
import CartItem from 'src/components/cart/CartItem'
import ProductCard from 'src/components/product/ProductCard'

// Use with GraphQL data
<ProductCard
  product={productData}
  index={0}
/>
```

## Data Flow

```
CMS/API → GraphQL Query → SDK Hooks → Matter Component → Analytics Event
                                    ↓
                          Foundational Component
```

## Analytics Events

Matter components automatically fire analytics events:

- `view_item` - Product viewed
- `add_to_cart` - Item added to cart
- `remove_from_cart` - Item removed from cart
- `begin_checkout` - Checkout started
- `search` - Search performed
- `select_item` - Product clicked

## CMS Integration

Section components expose schema for content management:

```tsx
// Section schema
export const schema = {
  title: 'Hero',
  description: 'Hero banner section',
  fields: {
    title: { type: 'string' },
    subtitle: { type: 'string' },
    image: { type: 'image' },
    link: { type: 'link' }
  }
}
```

## Best Practices

### When to use Matter Components
- Building on FastStore architecture
- Need automatic analytics tracking
- Using VTEX platform
- Want CMS-configurable content
- Need Next.js optimizations

### When to use Foundational Components
- Custom ecommerce platforms
- Need full control over data fetching
- Using different analytics provider
- Building design system

## Related Documentation

- [Foundational Components](../components/README.md) - Base UI components
- [FastStore SDK](https://www.faststore.dev/reference/sdk)
- [GraphQL API](https://www.faststore.dev/reference/api)
- [CMS Integration](https://www.faststore.dev/docs/cms)
