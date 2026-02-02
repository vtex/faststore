# Table

## Intention
Display tabular data with rows and columns.

## Description
Table provides semantic table structure with TableHead, TableBody, TableRow, and TableCell components. Supports responsive styling and proper accessibility.

In ecommerce, used for size charts, spec comparisons, shipping rates, order history.

## Import
```tsx
import { Table } from '@faststore/components'
```

## Sub-components
- `TableHead` - Table header
- `TableBody` - Table body
- `TableRow` - Table row
- `TableCell` - Table cell
- `TableFooter` - Table footer

## Examples

```tsx
<Table>
  <TableHead>
    <TableRow>
      <TableCell>Product</TableCell>
      <TableCell>Price</TableCell>
      <TableCell>Quantity</TableCell>
    </TableRow>
  </TableHead>
  <TableBody>
    <TableRow>
      <TableCell>Product 1</TableCell>
      <TableCell>$29.99</TableCell>
      <TableCell>2</TableCell>
    </TableRow>
  </TableBody>
</Table>
```
