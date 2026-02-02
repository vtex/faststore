# Gift

## Intention
Display gift item with image and content.

## Description
Gift component displays gift options or gift wrapping selections. Includes image and content sections for presenting gift choices.

In ecommerce, used for gift wrapping options, gift cards, gift messages.

## Import
```tsx
import { Gift } from '@faststore/components'
```

## Sub-components
- `GiftImage` - Gift image container
- `GiftContent` - Gift details

## Examples

```tsx
<Gift>
  <GiftImage>
    <img src="/gift-box.jpg" alt="Gift wrapping" />
  </GiftImage>
  <GiftContent>
    <h3>Premium Gift Wrap</h3>
    <p>Beautiful ribbon and card included</p>
    <Price value={5.99} formatter={formatPrice} />
  </GiftContent>
</Gift>
```
