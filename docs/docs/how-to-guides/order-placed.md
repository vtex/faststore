# OrderPlaced FastStore integration

:::caution 
Make sure you have the `vtex.order-placed` app installed in your VTEX account.
:::

## Taking users to the newest OrderPlaced page

1. Go into your store's admin page at: `https://{accountName}.myvtex.com/admin`;
2. In the left-side navigation menu, find the *Checkout* option, under *Store Setup.* You should see this UI
    
  ![Checkout Admin](/img/how-to-guides/checkout-admin.png)
    
3. Now click on the blue button with a gear inside, and switch to the `Code` part;
4. Select `checkout-confirmation-custom.js` under *files.* This is where you need to add a bit of JavaScript to ensure that clients are redirected to the newest OrderPlaced available.
5. Add the following JavaScript code in the editor:

  ```jsx
  const og = new URLSearchParams(location.search).get('og')
  window.location.assign(`${window.location.origin}/api/io${windo  location.pathname}?og=${og}`)
  ```
    
  Now click the *Save* button, and that's it!
    
  :::caution 
  Notice that as soon as you hit the *Save* button, this change will be live to all clients.
  :::


## Customizing Header and Footer

Since your OrderPlaced page is now rendered by Store Framework, you can customize its header and footer, and you should do so, since they might include outdated links. To do so, you can follow the same steps described in [this recipe](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-customizing-the-header-and-footer-blocks-by-page).
