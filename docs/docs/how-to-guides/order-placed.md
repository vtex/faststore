# OrderPlaced FastStore integration

:::caution 
Make sure you have the `vtex.order-placed` app installed in your VTEX account.
:::

## Taking users to the newest OrderPlaced page

1. Go into your store's admin page at: `https://{accountName}.myvtex.com/admin`.
2. In the left-side navigation menu, find the *Checkout* option, under *Store Setup*. You should see this UI:
    
  ![Checkout Admin](/img/how-to-guides/checkout-admin.png)
    
3. Now click on the blue button with a gear inside, and switch to the `Code` part.
4. Select `checkout-confirmation-custom.js` under *files*. This is where you need to add a bit of JavaScript to ensure that clients are redirected to the newest OrderPlaced available.
5. Add the following JavaScript code in the editor:

  ```jsx
  const og = new URLSearchParams(location.search).get('og')
  window.location.assign(`${window.location.origin}/api/io${window.location.pathname}?og=${og}`)
  ```
    
  Now click on the *Save* button, and that's it!
    
  :::caution 
  Notice that as soon as you hit the *Save* button, this change will be live to all clients.
  :::


## Customizing Header and Footer

Since your OrderPlaced page is now rendered by Store Framework, you should customize its header and footer, because they might include outdated links. To do so, you can follow the same steps described in [this recipe](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-customizing-the-header-and-footer-blocks-by-page).

## Adjusting `my-account` links

After placing an order and being taken to the OrderPlaced page, a user is presented with a few options regarding their new order:

![Order Options block](/img/how-to-guides/op-order-options.png)

Each of these options is a button that takes the user to a page that's under the `/account` route (rendered by `vtex.my-account` app). To make sure users are taken to the correct pages, follow these steps.

1. Open your store's theme. This should be the same you used in the previous section;
2. Find the `"order-placed"` block definition and all of the blocks that are being used by its implementation;
3. Find the `op-order-options` block currently being used by your order-placed implementation. Notice that there might be a desktop and a mobile variant of this block;
4. Use the prop `myAccountPath` to tell the `op-order-options` block what's the correct route for your `/account`. If you followed the tutorial on how to integrate the `my-account` app into your FastStore store, the value for this prop should be `/api/io/account`.
