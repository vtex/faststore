# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.41.7](https://github.com/vtex/faststore/compare/v3.41.6...v3.41.7) (2025-04-24)

**Note:** Version bump only for package faststore

## [3.41.6](https://github.com/vtex/faststore/compare/v3.41.5...v3.41.6) (2025-04-24)

### Bug Fixes

- Search page blink ([#2789](https://github.com/vtex/faststore/issues/2789)) ([4fa98be](https://github.com/vtex/faststore/commit/4fa98bee61c7c5ad335afaa4b0572817e8a5124e)), closes [vtex-sites/faststoreqa.store#775](https://github.com/vtex-sites/faststoreqa.store/issues/775)

## [3.41.5](https://github.com/vtex/faststore/compare/v3.41.4...v3.41.5) (2025-04-22)

### Bug Fixes

- Tooltip positions ([#2799](https://github.com/vtex/faststore/issues/2799)) ([2044412](https://github.com/vtex/faststore/commit/20444128fbc609941793aec4472f498233878e6d))

## [3.41.4](https://github.com/vtex/faststore/compare/v3.41.3...v3.41.4) (2025-04-17)

**Note:** Version bump only for package faststore

## [3.41.3](https://github.com/vtex/faststore/compare/v3.41.2...v3.41.3) (2025-04-16)

### Bug Fixes

- Allow control to `Checkbox`'s `checked` attribute ([#2614](https://github.com/vtex/faststore/issues/2614)) ([f0b8f2b](https://github.com/vtex/faststore/commit/f0b8f2bdcda879854c84e99bc3f59844b16fb564))

## [3.41.2](https://github.com/vtex/faststore/compare/v3.41.1...v3.41.2) (2025-04-16)

### Bug Fixes

- add key prop to Component in App for better rendering ([#2793](https://github.com/vtex/faststore/issues/2793)) ([b790bc0](https://github.com/vtex/faststore/commit/b790bc069ee67dfc2907f01b84239c29bbdc83b6))

## [3.41.1](https://github.com/vtex/faststore/compare/v3.41.0...v3.41.1) (2025-04-16)

### Bug Fixes

- log error and properly end response in GraphQL handler ([#2792](https://github.com/vtex/faststore/issues/2792)) ([878923c](https://github.com/vtex/faststore/commit/878923cbecf073b06251c3fcdb79560b9ee6ebc0))

# [3.41.0](https://github.com/vtex/faststore/compare/v3.40.2...v3.41.0) (2025-04-15)

### Features

- explicitly add allowRedirect to IS req ([#2791](https://github.com/vtex/faststore/issues/2791)) ([379d614](https://github.com/vtex/faststore/commit/379d6141dd631da066d54d779512eace1ad63f7a))

## [3.40.2](https://github.com/vtex/faststore/compare/v3.40.1...v3.40.2) (2025-04-15)

### Bug Fixes

- handle invalid requests in `parseRequest` function ([#2790](https://github.com/vtex/faststore/issues/2790)) ([fca3c26](https://github.com/vtex/faststore/commit/fca3c265ecd4d9390775da9d6be014d9b26f40d1))

## [3.40.1](https://github.com/vtex/faststore/compare/v3.40.0...v3.40.1) (2025-04-14)

### Bug Fixes

- term required in `ClientSearchSuggestionsQuery` (useSuggestions) ([#2785](https://github.com/vtex/faststore/issues/2785)) ([17cc81c](https://github.com/vtex/faststore/commit/17cc81c41e6542b16b89053cb543926da67375c2))

# [3.40.0](https://github.com/vtex/faststore/compare/v3.39.0...v3.40.0) (2025-04-11)

### Features

- GA `view_item_list` event only when item is in viewport of `ProductGallery` ([#2771](https://github.com/vtex/faststore/issues/2771)) ([16a4efa](https://github.com/vtex/faststore/commit/16a4efa23b7459a4327df0bc994b96c15f44ee5e))

# [3.39.0](https://github.com/vtex/faststore/compare/v3.38.3...v3.39.0) (2025-04-11)

### Features

- MyAccount redirects using SSR - SFS-2440 ([#2782](https://github.com/vtex/faststore/issues/2782)) ([6f92f41](https://github.com/vtex/faststore/commit/6f92f41e647298734bcc0f503810845c1558fd6f))

## 3.38.3 (2025-04-11)

### Bug Fixes

- properly end response for unsupported HTTP methods in GraphQL API ([#2781](https://github.com/vtex/faststore/issues/2781)) ([58f6caf](https://github.com/vtex/faststore/commit/58f6cafa7946ddd3970994dece423f7fff8e55c8))
- update telemetry configuration to use integer ([#2780](https://github.com/vtex/faststore/issues/2780)) ([8e9900e](https://github.com/vtex/faststore/commit/8e9900e0e1824133f4751415a79e5c8edb70a332))

## [3.38.2](https://github.com/vtex/faststore/compare/v3.38.1...v3.38.2) (2025-04-10)

### Bug Fixes

- returns 4XX error when query not exist ([#2779](https://github.com/vtex/faststore/issues/2779)) ([013454e](https://github.com/vtex/faststore/commit/013454e6b5bcd1f0e6ddb4d5ff49affd664a9209))

## [3.38.1](https://github.com/vtex/faststore/compare/v3.38.0...v3.38.1) (2025-04-10)

**Note:** Version bump only for package faststore

# [3.38.0](https://github.com/vtex/faststore/compare/v3.37.0...v3.38.0) (2025-04-10)

### Features

- only send is query event when url has fuzzy and operator ([#2774](https://github.com/vtex/faststore/issues/2774)) ([c6d722e](https://github.com/vtex/faststore/commit/c6d722e55dde5cab16005505f84448a2070fae78))

# [3.37.0](https://github.com/vtex/faststore/compare/v3.36.0...v3.37.0) (2025-04-10)

### Features

- Add PDP redirects support ([#2777](https://github.com/vtex/faststore/issues/2777)) ([fe76b0e](https://github.com/vtex/faststore/commit/fe76b0ed9f63f393cb54c57cf955be76c1d16cde)), closes [#2583](https://github.com/vtex/faststore/issues/2583) [vtex-sites/faststoreqa.store#764](https://github.com/vtex-sites/faststoreqa.store/issues/764)

# [3.36.0](https://github.com/vtex/faststore/compare/v3.35.1...v3.36.0) (2025-04-09)

### Features

- My Account Menu and Extensibility ([#2761](https://github.com/vtex/faststore/issues/2761)) ([0daf07a](https://github.com/vtex/faststore/commit/0daf07a7fdf524992472d9f9b4a013885aa175a2)), closes [#2729](https://github.com/vtex/faststore/issues/2729) [#2720](https://github.com/vtex/faststore/issues/2720) [#2738](https://github.com/vtex/faststore/issues/2738) [#2752](https://github.com/vtex/faststore/issues/2752)

## [3.35.1](https://github.com/vtex/faststore/compare/v3.35.0...v3.35.1) (2025-04-08)

### Bug Fixes

- multiple view_cart events ([#2770](https://github.com/vtex/faststore/issues/2770)) ([9e8234b](https://github.com/vtex/faststore/commit/9e8234b0e097b7c4a749584e491c556cbdab4a31))

# [3.35.0](https://github.com/vtex/faststore/compare/v3.34.0...v3.35.0) (2025-04-08)

### Features

- add API GraphQL cache control using flags ([#2756](https://github.com/vtex/faststore/issues/2756)) ([8b4dc64](https://github.com/vtex/faststore/commit/8b4dc6485f9e262cc5da47a51c3075715acdb0db))

# [3.34.0](https://github.com/vtex/faststore/compare/v3.33.5...v3.34.0) (2025-04-08)

### Features

- prevents double page_view events ([#2767](https://github.com/vtex/faststore/issues/2767)) ([82fca88](https://github.com/vtex/faststore/commit/82fca888b6d203744ad66e6e009046d3088f42db))

## [3.33.5](https://github.com/vtex/faststore/compare/v3.33.4...v3.33.5) (2025-04-03)

### Bug Fixes

- loading rc with accountName ([#2762](https://github.com/vtex/faststore/issues/2762)) ([d49e996](https://github.com/vtex/faststore/commit/d49e9961884a0d5c1c2a7078f718b4214370de94))

## [3.33.4](https://github.com/vtex/faststore/compare/v3.33.3...v3.33.4) (2025-04-02)

### Bug Fixes

- validate response status before parsing to json ([#2759](https://github.com/vtex/faststore/issues/2759)) ([f10400c](https://github.com/vtex/faststore/commit/f10400cb57aeb85bee71c3d7d38857d7983b6c41))

## [3.33.3](https://github.com/vtex/faststore/compare/v3.33.2...v3.33.3) (2025-04-01)

### Bug Fixes

- handle params and prevents send `page=NaN` or `count=0` to IS ([#2755](https://github.com/vtex/faststore/issues/2755)) ([c0f6e2f](https://github.com/vtex/faststore/commit/c0f6e2f9eef21be1f111f2ca902cae386159c43b))

## [3.33.2](https://github.com/vtex/faststore/compare/v3.33.1...v3.33.2) (2025-04-01)

### Bug Fixes

- adds .end to the catch of api/graphql ([#2754](https://github.com/vtex/faststore/issues/2754)) ([3465adc](https://github.com/vtex/faststore/commit/3465adcac170e4beeeacd5db8bfacdcab3a6b559))

## [3.33.1](https://github.com/vtex/faststore/compare/v3.33.0...v3.33.1) (2025-04-01)

### Bug Fixes

- Encode redirect destination ([#2757](https://github.com/vtex/faststore/issues/2757)) ([bbbcc6b](https://github.com/vtex/faststore/commit/bbbcc6be72112960c41ce70278f9130662bddfe5))

# [3.33.0](https://github.com/vtex/faststore/compare/v3.32.1...v3.33.0) (2025-03-31)

### Features

- loads first page product gallery from Build Time (getStaticProps) + improve number of requests (+) ([#2721](https://github.com/vtex/faststore/issues/2721)) ([9a74405](https://github.com/vtex/faststore/commit/9a74405b53ce31211e2d5a2c61874a535e47d654)), closes [/github.com/vtex/faststore/blob/47fd98ef2e3380bc2b84f5ff7922068d75077d45/packages/core/src/sdk/product/useShouldFetchFirstPage.ts#L3](https://github.com//github.com/vtex/faststore/blob/47fd98ef2e3380bc2b84f5ff7922068d75077d45/packages/core/src/sdk/product/useShouldFetchFirstPage.ts/issues/L3)

## [3.32.1](https://github.com/vtex/faststore/compare/v3.32.0...v3.32.1) (2025-03-28)

### Bug Fixes

- call redirect-evaluate only for pages ([#2748](https://github.com/vtex/faststore/issues/2748)) ([cc5bde1](https://github.com/vtex/faststore/commit/cc5bde1334a4eb1924a645a3587c2b66dd51fb84))

# [3.32.0](https://github.com/vtex/faststore/compare/v3.31.0...v3.32.0) (2025-03-27)

### Features

- Manually disable `hideUnavailableItems` flag for PDP queries ([#2747](https://github.com/vtex/faststore/issues/2747)) ([9022088](https://github.com/vtex/faststore/commit/90220885d1aa3a0213d447207353cf5b9d99be23)), closes [vtex-sites/starter.store#738](https://github.com/vtex-sites/starter.store/issues/738)

# [3.31.0](https://github.com/vtex/faststore/compare/v3.30.1...v3.31.0) (2025-03-26)

### Features

- adds deliveryChannel in shipping simulation ([#2746](https://github.com/vtex/faststore/issues/2746)) ([1dd68ed](https://github.com/vtex/faststore/commit/1dd68ed3465beec511b434258cb2e7ae3a3af214))

## [3.30.1](https://github.com/vtex/faststore/compare/v3.30.0...v3.30.1) (2025-03-25)

**Note:** Version bump only for package faststore

# [3.30.0](https://github.com/vtex/faststore/compare/v3.29.1...v3.30.0) (2025-03-21)

### Features

- Add plugins apis support ([#2664](https://github.com/vtex/faststore/issues/2664)) ([11f2fb7](https://github.com/vtex/faststore/commit/11f2fb718ba4b414d2da09d066711cd6e448b5c0))

## [3.29.1](https://github.com/vtex/faststore/compare/v3.29.0...v3.29.1) (2025-03-21)

### Bug Fixes

- pass cookies to intelligent search requests ([#2740](https://github.com/vtex/faststore/issues/2740)) ([fd4ba80](https://github.com/vtex/faststore/commit/fd4ba806ad37856829b1f737416a2e3aad042b0b))

# [3.29.0](https://github.com/vtex/faststore/compare/v3.28.1...v3.29.0) (2025-03-21)

### Features

- add UTM to orderForm ([#2736](https://github.com/vtex/faststore/issues/2736)) ([e423cef](https://github.com/vtex/faststore/commit/e423cef2992f003b8d8add119cb1847069a1571d)), closes [/github.com/vtex-apps/checkout-graphql/blob/df8f02932e9710fa437cf2c550e98cf9b7dc3726/node/resolvers/items.ts#L152-L157](https://github.com//github.com/vtex-apps/checkout-graphql/blob/df8f02932e9710fa437cf2c550e98cf9b7dc3726/node/resolvers/items.ts/issues/L152-L157)

## [3.28.1](https://github.com/vtex/faststore/compare/v3.28.0...v3.28.1) (2025-03-20)

### Bug Fixes

- PLP layout shift ([#2733](https://github.com/vtex/faststore/issues/2733)) ([ee01257](https://github.com/vtex/faststore/commit/ee01257ad2661527abdd5be28e7064dace19fd8d))

# 3.28.0 (2025-03-20)

### Bug Fixes

- add pnpm-lock.yaml to ignored files in biome.json ([#2737](https://github.com/vtex/faststore/issues/2737)) ([e308698](https://github.com/vtex/faststore/commit/e308698a406e27f0112ff1dc2e83564c42c83d85))

### Features

- add support for VTEX assets loader in image component ([#2731](https://github.com/vtex/faststore/issues/2731)) ([aea7456](https://github.com/vtex/faststore/commit/aea7456aaf0e6aacd0ba64759136c51fd08c642f)), closes [/#diff-4da6f8e98efa58c9a40ce9b654b9bfeecb6813091999cdea3d2408679d1bf3d3R119](https://github.com///issues/diff-4da6f8e98efa58c9a40ce9b654b9bfeecb6813091999cdea3d2408679d1bf3d3R119) [/#diff-73ffbd4b30ea7347ce7cc718527810b0f8b51f897bcf48efdd48fbe36652afdaR10-R15](https://github.com///issues/diff-73ffbd4b30ea7347ce7cc718527810b0f8b51f897bcf48efdd48fbe36652afdaR10-R15) [/#diff-73ffbd4b30ea7347ce7cc718527810b0f8b51f897bcf48efdd48fbe36652afdaR28-R39](https://github.com///issues/diff-73ffbd4b30ea7347ce7cc718527810b0f8b51f897bcf48efdd48fbe36652afdaR28-R39)

# [3.27.0](https://github.com/vtex/faststore/compare/v3.26.1...v3.27.0) (2025-03-20)

### Features

- update next-seo to ^6.6.0 and adjust SEO settings ([#2735](https://github.com/vtex/faststore/issues/2735)) ([75534f4](https://github.com/vtex/faststore/commit/75534f4c95b4d5d02b4b5b5e72b745adee856e62)), closes [/#diff-4da6f8e98efa58c9a40ce9b654b9bfeecb6813091999cdea3d2408679d1bf3d3R120-R121](https://github.com///issues/diff-4da6f8e98efa58c9a40ce9b654b9bfeecb6813091999cdea3d2408679d1bf3d3R120-R121) [/#diff-44cee9f10a52af4534def49e35d22467e888a2689e6f535f4009801be8917cd7R8-R9](https://github.com///issues/diff-44cee9f10a52af4534def49e35d22467e888a2689e6f535f4009801be8917cd7R8-R9) [/#diff-0b810c38f3c138a3d5e44854edefd5eb966617ca84e62f06511f60acc40546c7L74-R74](https://github.com///issues/diff-0b810c38f3c138a3d5e44854edefd5eb966617ca84e62f06511f60acc40546c7L74-R74)

## [3.26.1](https://github.com/vtex/faststore/compare/v3.26.0...v3.26.1) (2025-03-19)

### Bug Fixes

- Prevent whitespaces in Search page's `canonical` ([#2732](https://github.com/vtex/faststore/issues/2732)) ([224435f](https://github.com/vtex/faststore/commit/224435f4316fe0072fb702f3b2a97df0e9599847)), closes [vtex-sites/starter.store#726](https://github.com/vtex-sites/starter.store/issues/726)

# 3.26.0 (2025-03-19)

### Features

- Add SEO specifics for PDP ([#2730](https://github.com/vtex/faststore/issues/2730)) ([f2a0420](https://github.com/vtex/faststore/commit/f2a0420d6af360e2668641b38d4eae71419b1d72)), closes [vtex-sites/starter.store#724](https://github.com/vtex-sites/starter.store/issues/724)

## [3.25.11](https://github.com/vtex/faststore/compare/v3.25.10...v3.25.11) (2025-03-17)

**Note:** Version bump only for package faststore

## [3.25.10](https://github.com/vtex/faststore/compare/v3.25.9...v3.25.10) (2025-03-11)

### Bug Fixes

- override to use core breadcrumb component ([#2715](https://github.com/vtex/faststore/issues/2715)) ([7bb499b](https://github.com/vtex/faststore/commit/7bb499b7d7edd1a5959f1f3e7cd8399ef0cb71be))

## [3.25.9](https://github.com/vtex/faststore/compare/v3.25.8...v3.25.9) (2025-03-10)

**Note:** Version bump only for package faststore

## [3.25.8](https://github.com/vtex/faststore/compare/v3.25.7...v3.25.8) (2025-03-10)

### Bug Fixes

- Adds back SKUMatrix to PDP ([#2699](https://github.com/vtex/faststore/issues/2699)) ([90c8c04](https://github.com/vtex/faststore/commit/90c8c04be0c11a68bd0665cfe895d48ed9a9cd50))

## [3.25.7](https://github.com/vtex/faststore/compare/v3.25.6...v3.25.7) (2025-03-10)

### Bug Fixes

- Get offer url only if `enableClientOffer` is enabled ([#2680](https://github.com/vtex/faststore/issues/2680)) ([4d44454](https://github.com/vtex/faststore/commit/4d4445453abf03b2c450d81670fce01ef3a1c9c7))

## [3.25.6](https://github.com/vtex/faststore/compare/v3.25.5...v3.25.6) (2025-03-07)

### Bug Fixes

- Breadcrumb display and it style ([#2714](https://github.com/vtex/faststore/issues/2714)) ([d4f146d](https://github.com/vtex/faststore/commit/d4f146dc4b4570b1bbd6af16a84f68a1cdeab000))

## [3.25.5](https://github.com/vtex/faststore/compare/v3.25.4...v3.25.5) (2025-03-07)

### Bug Fixes

- Do not include similar categories in the breadcrumb list ([#2711](https://github.com/vtex/faststore/issues/2711)) ([c058011](https://github.com/vtex/faststore/commit/c058011e79ef451d2445488f67a1a058155505de))

## [3.25.4](https://github.com/vtex/faststore/compare/v3.25.3...v3.25.4) (2025-03-07)

### Bug Fixes

- ClientShippingSimulationQuery being called multiple times ([#2710](https://github.com/vtex/faststore/issues/2710)) ([5a85c10](https://github.com/vtex/faststore/commit/5a85c10166110e081992a65f7b6798e304f87c41))

## [3.25.3](https://github.com/vtex/faststore/compare/v3.25.2...v3.25.3) (2025-03-07)

### Bug Fixes

- Product Details' Buy Button excessive state reset ([#2712](https://github.com/vtex/faststore/issues/2712)) ([a84fdde](https://github.com/vtex/faststore/commit/a84fdde93f3a0b61f8a75bcc87143a03d864d768))

## [3.25.2](https://github.com/vtex/faststore/compare/v3.25.1...v3.25.2) (2025-03-06)

### Bug Fixes

- `Newsletter` section behaviour - SFS-2265 ([#2703](https://github.com/vtex/faststore/issues/2703)) ([7f7e98a](https://github.com/vtex/faststore/commit/7f7e98a82aef0c190f47b29b09e0ce7146d81873))

## [3.25.1](https://github.com/vtex/faststore/compare/v3.25.0...v3.25.1) (2025-02-28)

**Note:** Version bump only for package faststore

# [3.25.0](https://github.com/vtex/faststore/compare/v3.24.1...v3.25.0) (2025-02-28)

### Features

- Add `category`, `mainEntityOfPage` and `[@id](https://github.com/id)` to Product structured data ([#2694](https://github.com/vtex/faststore/issues/2694)) ([1e9f81e](https://github.com/vtex/faststore/commit/1e9f81eb85ad4d40f64181967940ef629d979a4a))

## [3.24.1](https://github.com/vtex/faststore/compare/v3.24.0...v3.24.1) (2025-02-26)

### Bug Fixes

- removes MissingContentError checks in getPage ([#2704](https://github.com/vtex/faststore/issues/2704)) ([0c75ea0](https://github.com/vtex/faststore/commit/0c75ea05b0d3c8ee62daa988c80152ba1464755c))

# [3.24.0](https://github.com/vtex/faststore/compare/v3.23.0...v3.24.0) (2025-02-26)

### Features

- Multiple global content types ([#2668](https://github.com/vtex/faststore/issues/2668)) ([8555310](https://github.com/vtex/faststore/commit/85553101b1d8f3ec510259007ff1d594ec33c338))

# [3.23.0](https://github.com/vtex/faststore/compare/v3.22.3...v3.23.0) (2025-02-26)

### Features

- adds `productTitle` and `metaTagDescription` from IS as SEO data from the PDP - SFS-2252 ([#2701](https://github.com/vtex/faststore/issues/2701)) ([ca368a0](https://github.com/vtex/faststore/commit/ca368a03f47a8c211baab2810d8057c87f3d854f))

## [3.22.3](https://github.com/vtex/faststore/compare/v3.22.2...v3.22.3) (2025-02-24)

### Bug Fixes

- add yarn to volta config ([#2698](https://github.com/vtex/faststore/issues/2698)) ([421bdca](https://github.com/vtex/faststore/commit/421bdca9105bd6f31e6f15db55192827ba8e6dfc))

## 3.22.2 (2025-02-20)

### Bug Fixes

- Removes CI invalid input ([#2689](https://github.com/vtex/faststore/issues/2689)) ([30ea4b5](https://github.com/vtex/faststore/commit/30ea4b5d38fee5f9aacda60c0bd3b3296875864c))
- Removes url image as required field for Organization ([#2697](https://github.com/vtex/faststore/issues/2697)) ([f325a28](https://github.com/vtex/faststore/commit/f325a28764767fdd6b92d22ef06703a78afdf1a6))

## [3.22.1](https://github.com/vtex/faststore/compare/v3.22.0...v3.22.1) (2025-02-18)

**Note:** Version bump only for package faststore

# [3.22.0](https://github.com/vtex/faststore/compare/v3.21.0...v3.22.0) (2025-02-18)

### Features

- add textareafield component ([#2641](https://github.com/vtex/faststore/issues/2641)) ([5e8dbf3](https://github.com/vtex/faststore/commit/5e8dbf392ee32feede0cdc6174c526a10ce19a22)), closes [PR#2640](https://github.com/PR/issues/2640)

# [3.21.0](https://github.com/vtex/faststore/compare/v3.20.0...v3.21.0) (2025-02-18)

### Features

- empty search with global sections ([#2690](https://github.com/vtex/faststore/issues/2690)) ([56c67d8](https://github.com/vtex/faststore/commit/56c67d8847f5b7c1c8d1d693a70c2f80c48f6c2a))

# [3.20.0](https://github.com/vtex/faststore/compare/v3.19.0...v3.20.0) (2025-02-18)

### Features

- add tooltip component ([#2644](https://github.com/vtex/faststore/issues/2644)) ([ed1826d](https://github.com/vtex/faststore/commit/ed1826d86751b3304f8297432facbe795ae6e91f))

# [3.19.0](https://github.com/vtex/faststore/compare/v3.18.0...v3.19.0) (2025-02-18)

### Features

- Adding organization structured data json ([#2623](https://github.com/vtex/faststore/issues/2623)) ([c97f437](https://github.com/vtex/faststore/commit/c97f4371b694bb55e812c866154e4ed3e594f868))

# [3.18.0](https://github.com/vtex/faststore/compare/v3.17.0...v3.18.0) (2025-02-17)

### Features

- create modal footer compound component ([#2672](https://github.com/vtex/faststore/issues/2672)) ([1a55c95](https://github.com/vtex/faststore/commit/1a55c95f6a2a6cf356647999befab9ba3897c8e7))

# [3.17.0](https://github.com/vtex/faststore/compare/v3.16.0...v3.17.0) (2025-02-17)

### Features

- create textarea component ([#2640](https://github.com/vtex/faststore/issues/2640)) ([15271ca](https://github.com/vtex/faststore/commit/15271cadb0d526ac5a1322a33b57d78635a9976d))

# [3.16.0](https://github.com/vtex/faststore/compare/v3.15.3...v3.16.0) (2025-02-13)

### Features

- add rating field ([#2636](https://github.com/vtex/faststore/issues/2636)) ([f6ab024](https://github.com/vtex/faststore/commit/f6ab024ca606a5f3c59732df02c933063187124a)), closes [PR#2635](https://github.com/PR/issues/2635)

## 3.15.3 (2025-02-13)

### Bug Fixes

- attempts to run publish directly in ci ([#2683](https://github.com/vtex/faststore/issues/2683)) ([44bb50d](https://github.com/vtex/faststore/commit/44bb50d0f03285cb3e48284004675a81385ade9b))

## [3.15.2](https://github.com/vtex/faststore/compare/v3.15.1...v3.15.2) (2025-02-05)

### Bug Fixes

- align ts versions ([#2673](https://github.com/vtex/faststore/issues/2673)) ([64035df](https://github.com/vtex/faststore/commit/64035df4d15334fffe66b55d81f475449bc7839e))

## [3.15.1](https://github.com/vtex/faststore/compare/v3.15.0...v3.15.1) (2025-02-04)

### Bug Fixes

- adds revalidate as false when not experimental ([#2671](https://github.com/vtex/faststore/issues/2671)) ([75331e0](https://github.com/vtex/faststore/commit/75331e0008cf41a70b3ab0f47a6fd28f85fd1a84))

# 3.15.0 (2025-02-04)

### Bug Fixes

- update lock file ([#2670](https://github.com/vtex/faststore/issues/2670)) ([12a440d](https://github.com/vtex/faststore/commit/12a440d2b30e37a4bb6ddc933b5a19b20d11c6a4))

### Features

- Offer SDK ([#2575](https://github.com/vtex/faststore/issues/2575)) ([f4e11ac](https://github.com/vtex/faststore/commit/f4e11ac68ae4afd79a1a89c122155e18bc452ad5))

## [3.14.3](https://github.com/vtex/faststore/compare/v3.14.2...v3.14.3) (2025-02-04)

### Bug Fixes

- remove unnecessary colon ([#2669](https://github.com/vtex/faststore/issues/2669)) ([b0475c3](https://github.com/vtex/faststore/commit/b0475c38fe71a1ef2930cd58445c2387794d5066))

## 3.14.2 (2025-02-03)

**Note:** Version bump only for package faststore

## [3.14.1](https://github.com/vtex/faststore/compare/v3.14.0...v3.14.1) (2025-02-03)

**Note:** Version bump only for package faststore

# [3.14.0](https://github.com/vtex/faststore/compare/v3.13.1...v3.14.0) (2025-02-03)

### Features

- add h1 in EmptySearch component ([#2659](https://github.com/vtex/faststore/issues/2659)) ([76088bb](https://github.com/vtex/faststore/commit/76088bb166cf0cf8ebbb22558961dc1484daa4b4))

## 3.13.1 (2025-01-31)

### Bug Fixes

- husky config ([#2661](https://github.com/vtex/faststore/issues/2661)) ([38ffbaf](https://github.com/vtex/faststore/commit/38ffbaf1b8c68609dc9a8c44437984e362761c60))

# [3.13.0](https://github.com/vtex/faststore/compare/v3.12.1...v3.13.0) (2025-01-31)

### Features

- enables search seo `noFollow` from config ([#2656](https://github.com/vtex/faststore/issues/2656)) ([96ba214](https://github.com/vtex/faststore/commit/96ba2142c9255a67456e95f0600f21eb60681441))

## [3.12.1](https://github.com/vtex/faststore/compare/v3.12.0...v3.12.1) (2025-01-30)

**Note:** Version bump only for package faststore

# [3.12.0](https://github.com/vtex/faststore/compare/v3.11.4...v3.12.0) (2025-01-29)

### Features

- enables search page seo `noIndex` from config ([#2652](https://github.com/vtex/faststore/issues/2652)) ([31c61a6](https://github.com/vtex/faststore/commit/31c61a65ad1774f19c53e7b2ce7af157d24434d9))

## [3.11.4](https://github.com/vtex/faststore/compare/v3.11.3...v3.11.4) (2025-01-29)

**Note:** Version bump only for package faststore

## [3.11.3](https://github.com/vtex/faststore/compare/v3.11.2...v3.11.3) (2025-01-29)

**Note:** Version bump only for package faststore

## [3.11.2](https://github.com/vtex/faststore/compare/v3.11.1...v3.11.2) (2025-01-29)

**Note:** Version bump only for package faststore

## [3.11.1](https://github.com/vtex/faststore/compare/v3.11.0...v3.11.1) (2025-01-29)

**Note:** Version bump only for package faststore

# [3.11.0](https://github.com/vtex/faststore/compare/v3.10.0...v3.11.0) (2025-01-29)

### Features

- search page with SSR ([#2619](https://github.com/vtex/faststore/issues/2619)) ([6fd2d0d](https://github.com/vtex/faststore/commit/6fd2d0d5e92f0922f8d97237d9d04a7eadc5e894))

# [3.10.0](https://github.com/vtex/faststore/compare/v3.9.3...v3.10.0) (2025-01-29)

### Features

- add `title` and `description` templates for product listing pages ([#2643](https://github.com/vtex/faststore/issues/2643)) ([00221d9](https://github.com/vtex/faststore/commit/00221d98439b693af3c2c0082ec7ef600637e19e))

## [3.9.3](https://github.com/vtex/faststore/compare/v3.9.2...v3.9.3) (2025-01-28)

### Bug Fixes

- **sdk:** safari rendering ([#2642](https://github.com/vtex/faststore/issues/2642)) ([39746cd](https://github.com/vtex/faststore/commit/39746cd6094ca1f3f08918b88c20c47d87dadd19))

## [3.9.2](https://github.com/vtex/faststore/compare/v3.9.1...v3.9.2) (2025-01-27)

**Note:** Version bump only for package faststore

## [3.9.1](https://github.com/vtex/faststore/compare/v3.9.0...v3.9.1) (2025-01-27)

### Bug Fixes

- **api:** Use collection `name` when `title` isn't available ([#2625](https://github.com/vtex/faststore/issues/2625)) ([236bb3c](https://github.com/vtex/faststore/commit/236bb3cffb5ca58b2393c618e03ce2545f5fab71))

# 3.9.0 (2025-01-22)

### Features

- Adds Plugins feature ([#2563](https://github.com/vtex/faststore/issues/2563)) ([83c1bf9](https://github.com/vtex/faststore/commit/83c1bf904f744842060e0dfdb7449406800df157))

# [3.8.0](https://github.com/vtex/faststore/compare/v3.7.0...v3.8.0) (2025-01-15)

### Features

- load out of viewport sections after TTI ([#2604](https://github.com/vtex/faststore/issues/2604)) ([98f8109](https://github.com/vtex/faststore/commit/98f8109d406150edf8172a4b8f8e3d4f39f28362))

# [3.7.0](https://github.com/vtex/faststore/compare/v3.6.0...v3.7.0) (2025-01-15)

### Features

- adds SKUMatrix component ([#2588](https://github.com/vtex/faststore/issues/2588)) ([0d7db56](https://github.com/vtex/faststore/commit/0d7db567be1e7b9b9375580b0a8cf665ee69d1c0))

# [3.6.0](https://github.com/vtex/faststore/compare/v3.5.1...v3.6.0) (2025-01-13)

### Features

- Consider order number from Checkout cookie ([#2592](https://github.com/vtex/faststore/issues/2592)) ([b1198db](https://github.com/vtex/faststore/commit/b1198db94b065f5ad4ab742a717c1b43030c22dd))

## [3.5.1](https://github.com/vtex/faststore/compare/v3.5.0...v3.5.1) (2025-01-09)

### Bug Fixes

- Reset infinite scroll if search's total pages is less than current state's total pages ([#2610](https://github.com/vtex/faststore/issues/2610)) ([7faedd2](https://github.com/vtex/faststore/commit/7faedd2ac636a354f0d6c3160309d5d1245ff27b))

# 3.5.0 (2025-01-09)

### Bug Fixes

- revert the commit ccfbac80a8694b8e674c4657d51e3478ff2605bd ([#2609](https://github.com/vtex/faststore/issues/2609)) ([49679ae](https://github.com/vtex/faststore/commit/49679ae3a735f7fa29d716b6e9f6d4941d73a647))

### Features

- Dynamically import `BreadcrumbBase` internal components ([#2611](https://github.com/vtex/faststore/issues/2611)) ([0992d10](https://github.com/vtex/faststore/commit/0992d10f0a12b54cd79403720abc0198a4d8f3e2))

## 3.4.4 (2024-12-20)

### Bug Fixes

- removes `useUI()` dependents sections from `LazyLoadingSection` ([#2602](https://github.com/vtex/faststore/issues/2602)) ([1953438](https://github.com/vtex/faststore/commit/1953438b29ec0081f0dc12fe73a06cd10225a8e8))

## 3.4.3 (2024-12-20)

**Note:** Version bump only for package faststore

## 3.4.2 (2024-12-20)

**Note:** Version bump only for package faststore

## 3.4.1 (2024-12-20)

**Note:** Version bump only for package faststore

# [3.4.0](https://github.com/vtex/faststore/compare/v3.3.0...v3.4.0) (2024-12-19)

### Features

- handle RC Events ([#2567](https://github.com/vtex/faststore/issues/2567)) ([486563d](https://github.com/vtex/faststore/commit/486563dd6e15a04686c99bcfaea6f216520255c9))

# [3.3.0](https://github.com/vtex/faststore/compare/v3.2.1...v3.3.0) (2024-12-18)

### Features

- `Filter` with next/dynamic and lazy import ([#2596](https://github.com/vtex/faststore/issues/2596)) ([73e5496](https://github.com/vtex/faststore/commit/73e54965e656f848c20865cd2760158d634bb0c0))

## [3.2.1](https://github.com/vtex/faststore/compare/v3.2.0...v3.2.1) (2024-12-16)

**Note:** Version bump only for package faststore

# [3.2.0](https://github.com/vtex/faststore/compare/v3.1.4...v3.2.0) (2024-12-16)

### Features

- add new redirects feature ([#2583](https://github.com/vtex/faststore/issues/2583)) ([4624a5d](https://github.com/vtex/faststore/commit/4624a5d101fccc40788c362ab744f250386a8d4d))

## [3.1.4](https://github.com/vtex/faststore/compare/v3.1.3...v3.1.4) (2024-12-16)

**Note:** Version bump only for package faststore

## 3.1.3 (2024-12-13)

**Note:** Version bump only for package faststore

## [3.1.2](https://github.com/vtex/faststore/compare/v3.1.1...v3.1.2) (2024-12-11)

### Bug Fixes

- **sdk:** page view event trigger ([#2586](https://github.com/vtex/faststore/issues/2586)) ([3988760](https://github.com/vtex/faststore/commit/398876013a293302f9a802b93f0f0880cfe32acb))

## [3.1.1](https://github.com/vtex/faststore/compare/v3.1.0...v3.1.1) (2024-12-09)

### Bug Fixes

- `Sentinel` rendering and wrong PLP's pagination behavior ([#2585](https://github.com/vtex/faststore/issues/2585)) ([ea59e77](https://github.com/vtex/faststore/commit/ea59e77fccee7866bd4e44b73e855dd5cee4ba6e)), closes [vtex-sites/starter.store#630](https://github.com/vtex-sites/starter.store/issues/630)

# [3.1.0](https://github.com/vtex/faststore/compare/v3.0.160...v3.1.0) (2024-12-09)

### Features

- add ads label product card ([#2582](https://github.com/vtex/faststore/issues/2582)) ([ae6f655](https://github.com/vtex/faststore/commit/ae6f6558dd76fb2061fa5992e5cea5bcd2142ac5))

## 3.0.160 (2024-12-09)

### Features

- generate semantic release from the commit merged into main ([#2576](https://github.com/vtex/faststore/issues/2576)) ([9b45140](https://github.com/vtex/faststore/commit/9b45140cc25a04eb9168fa98c523b0419937da4c))
