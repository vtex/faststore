# Queries

Arguments must be provided by the user.

Arguments preeceded by an exclamation mark (`!`) are not nullable.

## Product

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
<td colspan="2" valign="top"><strong><a href="/reference/api/queries/product">product</a></strong></td>
<td valign="top"><a href="/reference/api/objects/#storeproduct">StoreProduct</a>!</td>
<td>

Returns the details of a **product** based on the specified **locator**.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">locator</td>
<td valign="top">[<a href="/reference/api/inputs/#istoreselectedfacet">IStoreSelectedFacet</a>!]!</td>
<td>
An array of selected search facets.
</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong><a href="/reference/api/queries/allProducts">allProducts</a></strong></td>
<td valign="top"><a href="/reference/api/objects/#storeproductconnection">StoreProductConnection</a>!</td>
<td>

Returns information about **all products**.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="/reference/api/scalars/#int">Int</a>!</td>
<td>
Product pagination argument, indicating how many items should be returned from the complete result list.
</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="/reference/api/scalars/#string">String</a></td>
<td>
Product pagination argument, indicating the cursor corresponding with the item after which the results should be fetched.
</td>
</tr>
</tbody>
</table>

## Collection

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
<td colspan="2" valign="top"><strong><a href="/reference/api/queries/collection">collection</a></strong></td>
<td valign="top"><a href="/reference/api/objects/#storecollection">StoreCollection</a>!</td>
<td>

Returns the details of a **collection** based on the collection **slug**.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">slug</td>
<td valign="top"><a href="/reference/api/scalars/#string">String</a>!</td>
<td>
Collection slug.
</td>
</tr>

<tr>
<td colspan="2" valign="top"><strong><a href="/reference/api/queries/allCollections">allCollections</a></strong></td>
<td valign="top"><a href="/reference/api/objects/#storecollectionconnection">StoreCollectionConnection</a>!</td>
<td>

Returns information about **all collections**.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="/reference/api/scalars/#int">Int</a>!</td>
<td>
Collection pagination argument, indicating how many items should be returned from the complete result list.
</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="/reference/api/scalars/#string">String</a></td>
<td>
Collection pagination argument, indicating the cursor corresponding with the item after which the items should be fetched.
</td>
</tr>
</tbody>
</table>

## Search

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
<td colspan="2" valign="top"><strong><a href="/reference/api/queries/search">search</a></strong></td>
<td valign="top"><a href="/reference/api/objects/#storesearchresult">StoreSearchResult</a>!</td>
<td>

Returns the result of a `product`, `facet`, or `suggestion` search.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">first</td>
<td valign="top"><a href="/reference/api/scalars/#int">Int</a>!</td>
<td>
Search pagination argument, indicating how many results should be returned from the complete result list.
</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">after</td>
<td valign="top"><a href="/reference/api/scalars/#string">String</a></td>
<td>
Search pagination argument, indicating the cursor corresponding with the item after which the results should be fetched.
</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">sort</td>
<td valign="top"><a href="/reference/api/enums/#storesort">StoreSort</a></td>
<td>
Search results sorting mode.
</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">term</td>
<td valign="top"><a href="/reference/api/scalars/#string">String</a></td>
<td>
Search term.
</td>
</tr>
</tbody>
</table>
