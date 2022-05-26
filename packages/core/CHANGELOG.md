# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Adds tests for analytics events on `CartItem` ([#66](https://github.com/vtex-sites/nextjs.store/pull/66))
- additionalProperty to CartItem id ([#47](https://github.com/vtex-sites/nextjs.store/pull/47))
- Applies new local tokens to `Link` ([#17](https://github.com/vtex-sites/nextjs.store/pull/17))
- Applies new local tokens to `Select` ([#16](https://github.com/vtex-sites/nextjs.store/pull/16))
- `Toggle` component ([#15](https://github.com/vtex-sites/nextjs.store/pull/15))
- Break into new tasks the `useQuery` fetcher execution ([#45](https://github.com/vtex-sites/nextjs.store/pull/45))
- Suspend queries in the `ButtonSignIn`, `ProductShelf` and `ProductTiles` ([#45](https://github.com/vtex-sites/nextjs.store/pull/45))
- Uses new WebOps Incremental Static Builds ([#39](https://github.com/vtex-sites/nextjs.store/pull/39))
- An initial integration of the search term & product suggestions ([#33](https://github.com/vtex-sites/nextjs.store/pull/33)).
- `ImageGallery` to PDP ([#6](https://github.com/vtex-sites/nextjs.store/pull/6))
- `add_to_cart` and `remove_from_cart` analytics events to `CartItem` ([#35](https://github.com/vtex-sites/nextjs.store/pull/35))
- `ButtonSignInFallback` component ([#45](https://github.com/vtex-sites/nextjs.store/pull/45))

### Changed

- LCP images to be fetched with a higher priority and improve the score ([#49](https://github.com/vtex-sites/nextjs.store/pull/49)).
- Uses `ProductCard` component from FSUI instead of `Card` ([#41](https://github.com/vtex-sites/nextjs.store/pull/41))
- `EmptyState` component to be customized with a rounded `variant` prop (`default` | `rounded`) ([#11](https://github.com/vtex-sites/nextjs.store/pull/11)).
- Uses camelCase classes when using CSS Modules ([#42](https://github.com/vtex-sites/nextjs.store/pull/42))
- `ImageGallery` now uses native scroll instead of `useSlider` ([#6](https://github.com/vtex-sites/nextjs.store/pull/6))

### Deprecated

### Removed

- The `default` nomenclature from global tokens ([#51](https://github.com/vtex-sites/nextjs.store/pull/51))

### Fixed
- Search suggestions missing locale info ([#71](https://github.com/vtex-sites/nextjs.store/pull/71))
- Limit custom props only for `img` and `link` tags ([#60](https://github.com/vtex-sites/nextjs.store/pull/60))
- Warning related to `fetchPriority` prop not being recognized as `img` and `link`'s prop ([#54](https://github.com/vtex-sites/nextjs.store/pull/54))
- Error on Storybook build when trying to import base CSS styles/mixins in CSS module files ([#53](https://github.com/vtex-sites/nextjs.store/pull/53))
- A missing gap between the Sign In link and Cart button on desktop ([#11](https://github.com/vtex-sites/nextjs.store/pull/11)).
- A bugged vertical gap with the `EmptyState` component inside the cart ([#11](https://github.com/vtex-sites/nextjs.store/pull/11)).
- Fixes Storybook build removing unused imports ([#40](https://github.com/vtex-sites/nextjs.store/pull/40))

### Security

## [22.19.0.beta] - 2022-05-06

### Added

- Applies new local tokens to `Input Text` ([#15](https://github.com/vtex-sites/nextjs.store/pull/14))
- New items to the checklist of the `pull_request_template.md` ([#4](https://github.com/vtex-sites/nextjs.store/pull/4))
- Integrates with search.query event api ([#2](https://www.github.com/vtex-sites/nextjs.store/pull/2))
- Applies new local tokens to `Badge` ([#462](https://www.github.com/vtex-sites/base.store/pull/462))
- Applies new local tokens to `Hero` ([#435](https://www.github.com/vtex-sites/base.store/pull/435))
- Applies new local tokens to `Quantity Selector` ([#448](https://www.github.com/vtex-sites/base.store/pull/448))

### Changed

- Renames `Badge` component prop `interactive` to `actionable` ([#20](https://github.com/vtex-sites/nextjs.store/pull/20))
- Accessibility tests to output what were the actual violations, not just how many ([#12](https://github.com/vtex-sites/nextjs.store/pull/12)).
- Changed name from BaseStore to GatsbyStore ([#497](https://github.com/vtex-sites/base.store/pull/497))
- `CHANGELOG.md` to link to PRs, removed a duplicated section, and fixed some markdown ([#13](https://github.com/vtex-sites/nextjs.store/pull/13))
- Update Regionalization input to use the `TextInput` component ([#9](https://github.com/vtex-sites/nextjs.store/pull/9))
- Update `RegionalizationButton` and `RegionalizationBar` to show the postal code ([#7](https://github.com/vtex-sites/nextjs.store/pull/7))
- Migrates to Next.JS ([#475](https://www.github.com/vtex-sites/base.store/pull/475))
- Applies new local tokens to `ProductShelf` component ([#464](https://www.github.com/vtex-sites/base.store/pull/464))
- Adds Storybook configs ([#463](https://www.github.com/vtex-sites/base.store/pull/463))
- Adds vtex search tracking script. With this we will populate TopSearches and Autocomplete indices ([#389](https://www.github.com/vtex-sites/base.store/pull/389))
- Add `RegionalizationBar`, `RegionalizationButton` components and integrates it on Mobile and Desktop devices ([#424](https://www.github.com/vtex-sites/base.store/pull/424))
- Applies new local tokens to `BannerText` ([#470](https://www.github.com/vtex-sites/base.store/pull/470))
- Update the Incentives component to handle CMS data ([#474](https://www.github.com/vtex-sites/base.store/pull/474))

### Deprecated

### Removed

- The GitHub Action that was running Lighthouse, as it was frequently failing and WebOps already runs it ([#484](https://www.github.com/vtex-sites/base.store/pull/484))
- Removes CSS imports of components that are not being used ([#476](https://www.github.com/vtex-sites/base.store/pull/476))

### Fixed

- Fix `ImageGallerySelector` arrow toggle according to scroll position ([#43](https://github.com/vtex-sites/nextjs.store/pull/43))
- Fixes `ProductCard` bordered variant ([#5](https://github.com/vtex-sites/nextjs.store/pull/5))
- Fix Storybook initialization ([#492](https://www.github.com/vtex-sites/base.store/pull/492))
- Fix styling issue on Regionalization Modal by adding the missing imports in layout.scss ([#488](https://www.github.com/vtex-sites/base.store/pull/488))
- Fix unused CSS problem by separating imports into different files for each page ([#473](https://www.github.com/vtex-sites/base.store/pull/473))
- Potential layout shift on Hero section fixed ([#472](https://www.github.com/vtex-sites/base.store/pull/472))
- Fix layout section spacings style ([#469](https://www.github.com/vtex-sites/base.store/pull/469))

### Security

## [0.2.2] - 2022-04-07

### Added

- Add `InputText` component ([#440](https://www.github.com/vtex-sites/base.store/pull/440))

### Changed

- Enable Stylelint for some files and apply the rules after the Theme structure ([#430](https://www.github.com/vtex-sites/base.store/pull/430))
- Upgrades to React18 ([#461](https://www.github.com/vtex-sites/base.store/pull/461))
- Uses new Automatic JSX runtime ([#460](https://www.github.com/vtex-sites/base.store/pull/460))
- Migrates Gatsby config files to TypeScript ([#373](https://www.github.com/vtex-sites/base.store/pull/373))
- Migrates to Gatsby v4 ([#456](https://www.github.com/vtex-sites/base.store/pull/456))
- Reduces the padding of `Breadcrumb`component ([#453](https://www.github.com/vtex-sites/base.store/pull/453))

### Fixed

- Fix `SlideOver` scroll background behavior ([#420](https://www.github.com/vtex-sites/base.store/pull/420))
- `SearchInput` margin left on mobile ([#457](https://www.github.com/vtex-sites/base.store/pull/457))
- Fixed BaseStore logo right margin on mobile devices ([#455](https://www.github.com/vtex-sites/base.store/pull/455))
- Fix PLP scroll bug after applying filters for the mobile version ([#454](https://www.github.com/vtex-sites/base.store/pull/454))

## [0.2.1] - 2022-04-04

### Added

- `RegionalizationModal` component ([#426](https://www.github.com/vtex-sites/base.store/pull/426))
- Add preloadQuery function ([#445](https://www.github.com/vtex-sites/base.store/pull/445))
- New file `styles/global/tokens.scss` containing all global design tokens. ([#442](https://www.github.com/vtex-sites/base.store/pull/442))
- Send channel string as search facet ([#428](https://www.github.com/vtex-sites/base.store/pull/428))
- Add the brand new BaseStore logo ([#447](https://www.github.com/vtex-sites/base.store/pull/447))
- Add `Dropdown` component in `Breadcrumb` component ([#436](https://www.github.com/vtex-sites/base.store/pull/436))

### Changed

- Replaces `onDismissTransition` callback by a Provider that handles opening/closing of modal/slide over's behavior ([#426](https://www.github.com/vtex-sites/base.store/pull/426))
- `OutOfStock` integrated with regionalization ([#441](https://www.github.com/vtex-sites/base.store/pull/441))
- Move ProductShelf and ProductTiles to the client side ([#431](https://www.github.com/vtex-sites/base.store/pull/431))
- Drop gatsby-plugin-image in favor of custom/simpler component ([#401](https://www.github.com/vtex-sites/base.store/pull/401))
- Replace `stylelint-config-rational-order` with `stylelint-config-recess-order` ([#415](https://www.github.com/vtex-sites/base.store/pull/415))
- Simplify filters component by using `useReducer` instead of multiple `useState` ([#422](https://www.github.com/vtex-sites/base.store/pull/422))
- Applies new local tokens to `ProductCard`. ([#425](https://www.github.com/vtex-sites/base.store/pull/425))
- `OutOfStock` style and success message. ([#399](https://www.github.com/vtex-sites/base.store/pull/399))
- Apply new local tokens to `Button` ([#442](https://www.github.com/vtex-sites/base.store/pull/442))
- Gather all `Button` variants in the folder (`ButtonBuy`, `ButtonLink`, `ButtonIcon`, `ButtonSignIn`) ([#442](https://www.github.com/vtex-sites/base.store/pull/442))

### Fixed

- CSS Warnings ([#434](https://www.github.com/vtex-sites/base.store/pull/434))
- Fix alert banner colors ([#442](https://www.github.com/vtex-sites/base.store/pull/442))

## [0.2.0] - 2022-04-01

### Added

- Add hideUnavailableItems at store.config ([#400](https://www.github.com/vtex-sites/base.store/pull/400))
- Sections component with `content-visibility: auto` ([#368](https://www.github.com/vtex-sites/base.store/pull/368))
- Webpack Bundle analyzer ([#357](https://www.github.com/vtex-sites/base.store/pull/357))
- `GatsbyLink` to `Link` ui component. ([#329](https://www.github.com/vtex-sites/base.store/pull/329))
- `Skeleton` loading components. ([#317](https://www.github.com/vtex-sites/base.store/pull/317))
- `SuggestionsTopSearch` component ([#355](https://www.github.com/vtex-sites/base.store/pull/355))
- `PostalCodeInput` component and `usePostalCode` hook. ([#322](https://www.github.com/vtex-sites/base.store/pull/322))
- `SuggestionProductCard` component. ([#359](https://www.github.com/vtex-sites/base.store/pull/359))
- `EmptyState` component. ([#367](https://www.github.com/vtex-sites/base.store/pull/367))
- `EmptyState` at the `ProductGallery` section. ([#367](https://www.github.com/vtex-sites/base.store/pull/367))
- `IconSVG` component to load SVG Icons. ([#378](https://www.github.com/vtex-sites/base.store/pull/378))
- `Suggestions` component. ([#372](https://www.github.com/vtex-sites/base.store/pull/372))
- `SearchHistory` component. ([#391](https://www.github.com/vtex-sites/base.store/pull/391))
- `Badge` interactive variation. ([#396](https://www.github.com/vtex-sites/base.store/pull/396))
- New folder `styles/global` containing all global styles. ([#407](https://www.github.com/vtex-sites/base.store/pull/407))
- Session mutation when the user enters a new postal code. ([#392](https://www.github.com/vtex-sites/base.store/pull/392))

### Changed

- Move inline styles to external stylesheet to improve TBT ([#408](https://www.github.com/vtex-sites/base.store/pull/408))
- Changed ProductGallery and EmptyGallery styles to make the search results page ([#387](https://www.github.com/vtex-sites/base.store/pull/387))
- Moved all icons to use Icon component ([#386](https://www.github.com/vtex-sites/base.store/pull/386))
- Moved common/IconsSVG to ui/Icons ([#386](https://www.github.com/vtex-sites/base.store/pull/386))
- Moved EmptyState from common to ui folder ([#386](https://www.github.com/vtex-sites/base.store/pull/386))
- Removed fit-in property from image component ([#375](https://www.github.com/vtex-sites/base.store/pull/375))
- Sections are now self-contained ([#371](https://www.github.com/vtex-sites/base.store/pull/371))
- Moves icons to `/static/icons` folder ([#357](https://www.github.com/vtex-sites/base.store/pull/357))
- Replaces page type redirects, a.k.a. `/account`, `/login` to a corresponding file in `/pages` folder ([#310](https://www.github.com/vtex-sites/base.store/pull/310))
- Replaces `let` declarations for `useRef` for better React compatibility ([#319](https://www.github.com/vtex-sites/base.store/pull/319))
- Refactors cart sidebar ([#325](https://www.github.com/vtex-sites/base.store/pull/325))
- `BreadcrumbWrapper` from components/ui folder to `Breadcrumb` at components/sections ([#326](https://www.github.com/vtex-sites/base.store/pull/326))
- Replace relative stylesheets imports with absolute path ([#349](https://www.github.com/vtex-sites/base.store/pull/349))
- Moves some `Filter` component logic to the API ([#321](https://www.github.com/vtex-sites/base.store/pull/321))
- `Sort` and `Button Filter` (Mobile) `Skeleton's` loading criteria ([#362](https://www.github.com/vtex-sites/base.store/pull/362))
- Keep the latest `Filter` component state (Mobile) ([#362](https://www.github.com/vtex-sites/base.store/pull/362))
- Implements the expanded mode of `Searchbar` in mobile devices. ([#369](https://www.github.com/vtex-sites/base.store/pull/369))
- Updates Lighthouse and Cypress URL with valid product links ([#369](https://www.github.com/vtex-sites/base.store/pull/369))
- `Hero` image responsive sizes for mobile and desktop. ([#363](https://www.github.com/vtex-sites/base.store/pull/363))
- `Badge` variants names ([#381](https://www.github.com/vtex-sites/base.store/pull/381))
- `Tiles` and `Tile` to use semantic list elements. ([#383](https://www.github.com/vtex-sites/base.store/pull/383))
- `postalCode` from storage to Session context. ([#388](https://www.github.com/vtex-sites/base.store/pull/388))
- Updates all tokens naming and simplifies the global styles. ([#407](https://www.github.com/vtex-sites/base.store/pull/407))
- Changes `theme.scss` file to `global/tokens.scss`. ([#407](https://www.github.com/vtex-sites/base.store/pull/407))

### Deprecated

- useWindowDimensions hook ([#328](https://www.github.com/vtex-sites/base.store/pull/328))

### Removed

- Frontend computation in favor of backend processing ([#411](https://www.github.com/vtex-sites/base.store/pull/411))
- Removing hooks folder and migrating these hooks to sdk ou inline them on components ([#377](https://www.github.com/vtex-sites/base.store/pull/377))
- gatsby-plugin-offline due to CLS on recurrent users ([#348](https://www.github.com/vtex-sites/base.store/pull/348))
- useWindowDimensions hook ([#340](https://www.github.com/vtex-sites/base.store/pull/340))
- Removes unused `<FacetedFilter/>` component ([#345](https://www.github.com/vtex-sites/base.store/pull/345))
- Unnecessary map at hooks ([#323](https://www.github.com/vtex-sites/base.store/pull/323))
- API style redirects from `/_v/private/graphql` since they have no effect ([#310](https://www.github.com/vtex-sites/base.store/pull/310))
- Display box from `<ProductCard/>` component ([#354](https://www.github.com/vtex-sites/base.store/pull/354))
- `useTotalCount` hook ([#362](https://www.github.com/vtex-sites/base.store/pull/362))
- Phosphor-react library ([#378](https://www.github.com/vtex-sites/base.store/pull/378))
- `main::store::postalCode` value from storage. ([#388](https://www.github.com/vtex-sites/base.store/pull/388))

### Fixed

- Unnecessary app rerender after login feature ([#418](https://www.github.com/vtex-sites/base.store/pull/418))
- Fix typos found across the codebase ([#412](https://www.github.com/vtex-sites/base.store/pull/412))
- Fix border style for Product Card and its skeleton on mobile ([#379](https://www.github.com/vtex-sites/base.store/pull/379))
- The divisor for the `Breadcrumb` component not rendering valid HTML. ([#365](https://www.github.com/vtex-sites/base.store/pull/365))
- useBuyButton/useRemoveButton hooks with inconsistent typings/behaviors ([#360](https://www.github.com/vtex-sites/base.store/pull/360))
- React tree re-rendering ([#328](https://www.github.com/vtex-sites/base.store/pull/328))
- Footer rendering pipeline ([#328](https://www.github.com/vtex-sites/base.store/pull/328))
- Scroll lock when transitioning pages on mobile via `SlideOver` component navigation ([#344](https://www.github.com/vtex-sites/base.store/pull/344))
- Filter Button specificity on desktop ([#346](https://www.github.com/vtex-sites/base.store/pull/346))
- Filter facets are not being selected on mobile ([#380](https://www.github.com/vtex-sites/base.store/pull/380))
- `CartItem` image size and truncate long product's title ([#405](https://www.github.com/vtex-sites/base.store/pull/405))
- Entrusting the definition of the cursor property to the browser ([#419](https://www.github.com/vtex-sites/base.store/pull/419))

## [0.1.1] - 2022-02-07

### Added

- Feat: Style IconButton ([#290](https://www.github.com/vtex-sites/base.store/pull/290))

### Changed

- Chore: tweaks search page ([#293](https://www.github.com/vtex-sites/base.store/pull/293))
- Extract UISelect from Sort to its own component ([#299](https://www.github.com/vtex-sites/base.store/pull/299))
- Feat: lazy loading and improvements (CLS) ([#300](https://www.github.com/vtex-sites/base.store/pull/300))

### Fixed

- SonarQube warning ([#297](https://www.github.com/vtex-sites/base.store/pull/297))
- General fixes on Beta component ([#287](https://www.github.com/vtex-sites/base.store/pull/287))
- Fix/Adjust inappropriate rerenders ([#304](https://www.github.com/vtex-sites/base.store/pull/304))

## [0.1.0] - 2022-02-01

Version released for the Closed Beta

### Added

- This changelog
