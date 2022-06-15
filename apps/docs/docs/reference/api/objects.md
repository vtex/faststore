# Objects

### StoreAggregateOffer

Aggregate offer information, for a given SKU that is available to be fulfilled by multiple sellers.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>highPrice</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Highest price among all sellers.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lowPrice</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Lowest price among all sellers.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>offerCount</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Number of sellers selling this SKU.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>priceCurrency</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

ISO code of the currency used for the offer prices.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>offers</strong></td>
<td valign="top">[<a href="#storeoffer">StoreOffer</a>!]!</td>
<td>

Array with information on each available offer.

</td>
</tr>
</tbody>
</table>

### StoreAggregateRating

Average rating, based on multiple ratings or reviews.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ratingValue</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Value of the aggregate rating.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>reviewCount</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Total number of ratings.

</td>
</tr>
</tbody>
</table>

### StoreAuthor

Information about the author of a product review or rating.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Author name.

</td>
</tr>
</tbody>
</table>

### StoreBrand

Brand of a given product.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Brand name.

</td>
</tr>
</tbody>
</table>

### StoreBreadcrumbList

List of items consisting of chain linked web pages, ending with the current page.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>itemListElement</strong></td>
<td valign="top">[<a href="#storelistitem">StoreListItem</a>!]!</td>
<td>

Array with breadcrumb elements.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>numberOfItems</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Number of breadcrumbs in the list.

</td>
</tr>
</tbody>
</table>

### StoreCart

Shopping cart information.

Mutated by [`validateCart`](/reference/api/mutations/cart).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>order</strong></td>
<td valign="top"><a href="#storeorder">StoreOrder</a>!</td>
<td>

Order information, including `orderNumber` and `acceptedOffer`.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>messages</strong></td>
<td valign="top">[<a href="#storecartmessage">StoreCartMessage</a>!]!</td>
<td>

List of shopping cart messages.

</td>
</tr>
</tbody>
</table>

### StoreCartMessage

Shopping cart message.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>text</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Shopping cart message text.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>status</strong></td>
<td valign="top"><a href="#storestatus">StoreStatus</a>!</td>
<td>

Shopping cart message status, which can be `INFO`, `WARNING` OR `ERROR`.

</td>
</tr>
</tbody>
</table>

### StoreCollection

Product collection information.

Queried by [`collection`](/reference/api/queries/collection).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>seo</strong></td>
<td valign="top"><a href="#storeseo">StoreSeo</a>!</td>
<td>

Meta tag data.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>breadcrumbList</strong></td>
<td valign="top"><a href="#storebreadcrumblist">StoreBreadcrumbList</a>!</td>
<td>

List of items consisting of chain linked web pages, ending with the current page.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>meta</strong></td>
<td valign="top"><a href="#storecollectionmeta">StoreCollectionMeta</a>!</td>
<td>

Collection meta information. Used for search.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="/reference/api/scalars#id">ID</a>!</td>
<td>

Collection ID.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Corresponding collection URL slug, with which to retrieve this entity.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#storecollectiontype">StoreCollectionType</a>!</td>
<td>

Collection type.

</td>
</tr>
</tbody>
</table>

### StoreCollectionConnection

Collection connection pagination information.

Queried by [`allCollections`](/reference/api/queries/allCollections).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="#storepageinfo">StorePageInfo</a>!</td>
<td>

Collection connection page information.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#storecollectionedge">StoreCollectionEdge</a>!]!</td>
<td>

Array with collection connection page edges.

</td>
</tr>
</tbody>
</table>

### StoreCollectionEdge

Collection pagination edge.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#storecollection">StoreCollection</a>!</td>
<td>

Collection pagination node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Collection pagination cursor.

</td>
</tr>
</tbody>
</table>

### StoreCollectionFacet

Product collection facet, used for search.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>key</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Facet key.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Facet value.

</td>
</tr>
</tbody>
</table>

### StoreCollectionMeta

Collection meta information. Used for search.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>selectedFacets</strong></td>
<td valign="top">[<a href="#storecollectionfacet">StoreCollectionFacet</a>!]!</td>
<td>

List of selected collection facets.

</td>
</tr>
</tbody>
</table>

### StoreCurrency

Currency information.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>code</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Currency code (e.g., USD)

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>symbol</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Currency symbol (e.g., $)

</td>
</tr>
</tbody>
</table>

### StoreFacet

Search facet information.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>key</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Facet key.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>label</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Facet label.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>values</strong></td>
<td valign="top">[<a href="#storefacetvalue">StoreFacetValue</a>!]!</td>
<td>

Array with information on each facet value.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#storefacettype">StoreFacetType</a>!</td>
<td>

Facet type. Possible values are `BOOLEAN` and `RANGE`.

</td>
</tr>
</tbody>
</table>

### StoreFacetValue

Information of a specific facet value.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Facet value.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>label</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Facet value label.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>selected</strong></td>
<td valign="top"><a href="/reference/api/scalars#boolean">Boolean</a>!</td>
<td>

Indicates whether facet is selected.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quantity</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Number of items with this facet.

</td>
</tr>
</tbody>
</table>

### StoreImage

Image.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>url</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Image URL.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>alternateName</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Alias for the image.

</td>
</tr>
</tbody>
</table>

### StoreListItem

Item of a list.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>item</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

List item value.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Name of the list item.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>position</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Position of the item in the list.

</td>
</tr>
</tbody>
</table>

### StoreOffer

Offer information.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>listPrice</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

This is displayed as the "from" price in the context of promotions' price comparison. This may change before it reaches the shelf.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sellingPrice</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Computed price before applying coupons, taxes or benefits. This may change before it reaches the shelf.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>priceCurrency</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

ISO code of the currency used for the offer prices.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>price</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Also known as spot price.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>priceValidUntil</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Next date in which price is scheduled to change. If there is no scheduled change, this will be set a year in the future from current time.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>itemCondition</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Offer item condition.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>availability</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Offer item availability.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>seller</strong></td>
<td valign="top"><a href="#storeorganization">StoreOrganization</a>!</td>
<td>

Seller responsible for the offer.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>itemOffered</strong></td>
<td valign="top"><a href="#storeproduct">StoreProduct</a>!</td>
<td>

Information on the item being offered.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>quantity</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Number of items offered.

</td>
</tr>
</tbody>
</table>

### StoreOrder

Information of a specific order.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>orderNumber</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

ID of the order in [VTEX order management](https://help.vtex.com/en/tutorial/license-manager-resources-oms--60QcBsvWeum02cFi3GjBzg#).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>acceptedOffer</strong></td>
<td valign="top">[<a href="#storeoffer">StoreOffer</a>!]!</td>
<td>

Array with information on each accepted offer.

</td>
</tr>
</tbody>
</table>

### StoreOrganization

Organization.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>identifier</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Organization ID.

</td>
</tr>
</tbody>
</table>

### StorePageInfo

Page information.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>hasNextPage</strong></td>
<td valign="top"><a href="/reference/api/scalars#boolean">Boolean</a>!</td>
<td>

Indicates whether next page exists.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hasPreviousPage</strong></td>
<td valign="top"><a href="/reference/api/scalars#boolean">Boolean</a>!</td>
<td>

Indicates whether previous page exists.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>startCursor</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Page cursor start.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>endCursor</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Page cursor end.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>totalCount</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Total number of items (products or collections), not pages.

</td>
</tr>
</tbody>
</table>

### StorePerson

Client profile data.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Client ID.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Client email.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>givenName</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Client first name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>familyName</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Client last name.

</td>
</tr>
</tbody>
</table>

### StoreProduct

Product information. Products are variants within product groups, equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on.

Queried by [`product`](/reference/api/queries/product).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>seo</strong></td>
<td valign="top"><a href="#storeseo">StoreSeo</a>!</td>
<td>

Meta tag data.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>breadcrumbList</strong></td>
<td valign="top"><a href="#storebreadcrumblist">StoreBreadcrumbList</a>!</td>
<td>

List of items consisting of chain linked web pages, ending with the current page.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Corresponding collection URL slug, with which to retrieve this entity.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Product name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>productID</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Product ID, such as [ISBN](https://www.isbn-international.org/content/what-isbn) or similar global IDs.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>brand</strong></td>
<td valign="top"><a href="#storebrand">StoreBrand</a>!</td>
<td>

Product brand.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Product description.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>image</strong></td>
<td valign="top">[<a href="#storeimage">StoreImage</a>!]!</td>
<td>

Array of images.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>offers</strong></td>
<td valign="top"><a href="#storeaggregateoffer">StoreAggregateOffer</a>!</td>
<td>

Aggregate offer information.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sku</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Stock Keeping Unit. Merchant-specific ID for the product.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>gtin</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Global Trade Item Number.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>review</strong></td>
<td valign="top">[<a href="#storereview">StoreReview</a>!]!</td>
<td>

Array with review information.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>aggregateRating</strong></td>
<td valign="top"><a href="#storeaggregaterating">StoreAggregateRating</a>!</td>
<td>

Aggregate ratings data.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isVariantOf</strong></td>
<td valign="top"><a href="#storeproductgroup">StoreProductGroup</a>!</td>
<td>

Indicates product group related to this product.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>additionalProperty</strong></td>
<td valign="top">[<a href="#storepropertyvalue">StorePropertyValue</a>!]!</td>
<td>

Array of additional properties.

</td>
</tr>
</tbody>
</table>

### StoreProductConnection

Product connection pagination information.

Queried by [`allProducts`](/reference/api/queries/allProducts).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>pageInfo</strong></td>
<td valign="top"><a href="#storepageinfo">StorePageInfo</a>!</td>
<td>

Product connection page information.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>edges</strong></td>
<td valign="top">[<a href="#storeproductedge">StoreProductEdge</a>!]!</td>
<td>

Array with product connection page edges.

</td>
</tr>
</tbody>
</table>

### StoreProductEdge

Product pagination edge.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>node</strong></td>
<td valign="top"><a href="#storeproduct">StoreProduct</a>!</td>
<td>

Product pagination node.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cursor</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Product pagination cursor.

</td>
</tr>
</tbody>
</table>

### StoreProductGroup

Product group information. Product groups are catalog entities that may contain variants. They are equivalent to VTEX [Products](https://help.vtex.com/en/tutorial/what-is-a-product--2zrB2gFCHyQokCKKE8kuAw#), whereas each variant is equivalent to a VTEX [SKU](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#). For example, you may have a **Shirt** product group with associated products such as **Blue shirt size L**, **Green shirt size XL** and so on.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>hasVariant</strong></td>
<td valign="top">[<a href="#storeproduct">StoreProduct</a>!]!</td>
<td>

Array of variants related to product group. Variants are equivalent to VTEX [SKUs](https://help.vtex.com/en/tutorial/what-is-an-sku--1K75s4RXAQyOuGUYKMM68u#).

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>productGroupID</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Product group ID.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Product group name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>additionalProperty</strong></td>
<td valign="top">[<a href="#storepropertyvalue">StorePropertyValue</a>!]!</td>
<td>

Array of additional properties.

</td>
</tr>
</tbody>
</table>

### StorePropertyValue

Properties that can be associated with products and products groups.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>propertyID</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Property id. This propert changes according to the content of the object.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="#objectorstring">ObjectOrString</a>!</td>
<td>

Property value. May hold a string or the string representation of an object.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Property name.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>valueReference</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Specifies the nature of the value

</td>
</tr>
</tbody>
</table>

### StoreReview

Information of a given review.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>reviewRating</strong></td>
<td valign="top"><a href="#storereviewrating">StoreReviewRating</a>!</td>
<td>

Review rating information.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>author</strong></td>
<td valign="top"><a href="#storeauthor">StoreAuthor</a>!</td>
<td>

Review author.

</td>
</tr>
</tbody>
</table>

### StoreReviewRating

Information of a given review rating.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>ratingValue</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Rating value.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>bestRating</strong></td>
<td valign="top"><a href="/reference/api/scalars#float">Float</a>!</td>
<td>

Best rating value.

</td>
</tr>
</tbody>
</table>

### StoreSearchResult

Search result.

Queried by [`search`](/reference/api/queries/search).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>products</strong></td>
<td valign="top"><a href="#storeproductconnection">StoreProductConnection</a>!</td>
<td>

Search result products.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>facets</strong></td>
<td valign="top">[<a href="#storefacet">StoreFacet</a>!]!</td>
<td>

Array of search result facets.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>suggestions</strong></td>
<td valign="top"><a href="#storesuggestions">StoreSuggestions</a>!</td>
<td>

Search result suggestions.

</td>
</tr>
</tbody>
</table>

### StoreSeo

Search Engine Optimization (SEO) tags data.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>title</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Title tag.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>titleTemplate</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Title template tag.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Description tag.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>canonical</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

Canonical tag.

</td>
</tr>
</tbody>
</table>

### StoreSession

Session information.

Mutated by [`updateSession`](/reference/api/mutations/session).

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>channel</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a></td>
<td>

Session channel.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>country</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a></td>
<td>

Session country.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>postalCode</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a></td>
<td>

Session postal code.

</td>
</tr>
</tbody>
</table>

### StoreSuggestionTerm

Suggestion term.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>value</strong></td>
<td valign="top"><a href="/reference/api/scalars#string">String</a>!</td>
<td>

The term.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="/reference/api/scalars#int">Int</a>!</td>
<td>

Its occurrences count.

</td>
</tr>
</tbody>
</table>

### StoreSuggestions

Suggestions information.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>terms</strong></td>
<td valign="top">[<a href="/reference/api/scalars#string">String</a>!]</td>
<td>

Array with suggestion terms.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>products</strong></td>
<td valign="top">[<a href="#storeproduct">StoreProduct</a>!]</td>
<td>

Array with suggestion products' information.

</td>
</tr>
</tbody>
</table>
