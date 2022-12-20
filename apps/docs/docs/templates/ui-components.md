---
description: Describe the component in 50-160 characters.
keywords:
  - UI library
  - ecommerce
  - react
---

import PropsSection from "@site/src/components/PropsSection/PropsSection";

_If applicable, adds the import below._

import { TokenTable, TokenRow, TokenDivider } from '@site/src/components/Tokens'

Briefly describe the component and its functions.

Example: The _add component name_ component is _add component meaning_ used to _add the component function_.

## Overview

```tsx live
<div>List component variants/types here if applicable</div>
```

---

## Import

Import the component from <a href="https://www.faststore.dev/reference/ui/get-started-faststore-ui">@faststore/ui</a>

```tsx
import { ComponentName } from '@faststore/ui'
```

Import Styles

```tsx
import '@faststore/ui/src/components/{folder}/{ComponentName}/styles.scss'
```

---

## Usage

```tsx live
/* Replace ComponentName with the name of the component. */
<ComponentName />
```

### Props

_Replace `ComponentName` with the component name._

<PropsSection name="ComponentName" />

---

## Design Tokens

> _Use this section to list components design tokens._

<TokenTable>
  <TokenRow
    token="--fs-component-property"
    value="var(--fs-global-property)"
  />
  <TokenDivider />
  <TokenRow
    token="--fs-component-property"
    value="var(--fs-global-property)"
  />
</TokenTable>

### Variants (Optional)

> _Use this section only if the component has variants._

#### VariantName

````tsx live
```tsx live
/* Replace ComponentName and VariantName accordingly. */
<ComponentName
  variant="variantName"
/>
````

---

## Use cases

Use the _ComponentName_ component to:

- _Add use case_
- _Add use case_
- _Add use case_

---

## Customization

_Add CSS handles (e.g., `data-fs-badge`)._

---

## Best practices

_List the component's best practices. Start each sentence with an imperative verb (e.g., `Use`, `Place`, `Add`.)_

### Do's

- _Add recommendation (e.g., Use tooltips only on elements that are keyboard-focusable and interactive.)_
- _Add recommendation_
- _Add recommendation_

### Don'ts

- _Add recommendation (e.g., Don't use color alone to convey information.)_
- _Add recommendation_
- _Add recommendation_

---

## Accessibility

_List the accessibility features of the component._

- _Add accessibility feature (e.g., Tab has role `tab`.)_
- _Add accessibility feature_
- _Add accessibility feature_
