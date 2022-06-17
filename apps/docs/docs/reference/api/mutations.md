# Mutation

## Cart

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
<td colspan="2" valign="top"><strong><a href="/reference/api/mutations/Cart">validateCart</a></strong></td>
<td valign="top"><a href="/reference/api/objects#storecart">StoreCart</a></td>
<td>

Checks for changes between the cart presented in the UI and the cart stored in the ecommerce platform. If changes are detected, it returns the cart stored on the platform. Otherwise, it returns `null`.

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">cart</td>
<td valign="top"><a href="/reference/api/inputs#istorecart">IStoreCart</a>!</td>
<td>
Shopping cart identifier.
</td>
</tr>
</tbody>
</table>

## Session

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
<td colspan="2" valign="top"><strong><a href="/reference/api/mutations/Session">updateSession</a></strong></td>
<td valign="top"><a href="/reference/api/objects#storesession">StoreSession</a>!</td>
<td>
Updates a web session with the specified values.
</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">session</td>
<td valign="top"><a href="/reference/api/inputs#istoresession">IStoreSession</a>!</td>
<td>
Web session identifier.
</td>
</tr>
</tbody>
</table>
