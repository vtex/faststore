# Inputs

### IStoreCart

Shopping cart input.

Used as input by [`validateCart`](/reference/api/mutations/validateCart).

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>order</strong></td>
<td valign="top"><a href="#istoreorder">IStoreOrder</a>!</td>
<td>

Order information, including `orderNumber` and `acceptedOffer`.

</td>
</tr>
</tbody>
</table>

### IStoreImage

Image input.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Image input URL.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>alternateName</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Alias for the input image.

</td>
</tr>
</tbody>
</table>

### IStoreOffer

Offer input.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>price</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td>

Also known as spot price.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>listPrice</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td>

This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>seller</strong></td>
<td valign="top"><a href="#istoreorganization">IStoreOrganization</a>!</td>
<td>

Seller responsible for the offer.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>itemOffered</strong></td>
<td valign="top"><a href="#istoreproduct">IStoreProduct</a>!</td>
<td>

Information on the item being offered.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quantity</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Number of items offered.

</td>
</tr>
</tbody>
</table>

### IStoreOrder

Offer input.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>orderNumber</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>acceptedOffer</strong></td>
<td valign="top">[<a href="#istoreoffer">IStoreOffer</a>!]!</td>
<td>

Array with information on each accepted offer.

</td>
</tr>
</tbody>
</table>

### IStoreOrganization

Organization input.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>identifier</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Organization ID.

</td>
</tr>
</tbody>
</table>

### IStoreProduct

Product input. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on.

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>sku</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Stock Keeping Unit. Merchant-specific ID for the product.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Product name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>image</strong></td>
<td valign="top">[<a href="#istoreimage">IStoreImage</a>!]!</td>
<td>

Array of product images.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>additionalProperty</strong></td>
<td valign="top">[<a href="#istorepropertyvalue">IStorePropertyValue</a>!]</td>
<td>

Custom Product Additional Properties.

</td>
</tr>
</tbody>
</table>

### IStorePropertyValue

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#objectorstring">ObjectOrString</a>!</td>
<td>

Property value. May hold a string or the string representation of an object.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Property name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>valueReference</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

Specifies the nature of the value

</td>
</tr>
</tbody>
</table>

### IStoreSelectedFacet

Selected facet input.

Used as input by [`product`](/reference/api/queries/product) and [`search`](/reference/api/queries/search).

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>key</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### IStoreSession

Session input.

Used as input by [`updateSession`](/reference/api/mutations/updateSession).

<table>
<thead>
<tr>
<th colspan="2" align="left">Field</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>channel</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Session input channel.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>country</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Session input country.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>postalCode</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td>

Session input postal code.

</td>
</tr>
</tbody>
</table>