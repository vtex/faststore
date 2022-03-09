---
sidebar_position: 3
---

# Integrating the VTEX Checkout

In this guide, you'll learn how to integrate your **FastStore** project with the **VTEX Checkout**. The Checkout comprehends the pages responsible for receiving the shopper's information necessary to process an order.

To successfully integrate the VTEX Checkout with your FastStore project, you must ensure that:
- Shoppers will be presented with an updated version of the Order Placed page once they place an order. 
- All links in the Header and Footer of the Checkout point to your FastStore website.

## Before you start

Before proceeding any further, make sure you already have:
- [Your FastStore + VTEX website hosted on the internet](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website).

---

## Step by step

### Step 1 - Setting up the Order Placed page

Take the following steps to guarantee shoppers will be redirected to the newest version of the **Order Placed** page in your store:

1. Access the **VTEX Admin**.
2. Go to **Store Setup > Checkout**.
3. Click on the **gear button** <img class="inline w-8" src="/img/how-to-guides/gear-button.png"/> in the **Default** card.
4. Change to the **Code** tab. 
5. Select `checkout-confirmation-custom.js` under **Files**. 
6. Add the following JavaScript code in the editor:

  ```jsx {4-5} title="checkout-confirmation-custom.js"
  // WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE.
  // THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

  const og = new URLSearchParams(location.search).get('og')
  window.location.assign(`${window.location.origin}/api/io${window.location.pathname}?og=${og}`)
  ```
    
7. Click on **Save**. Notice that, as soon as you hit the *Save* button, your changes will be live to all clients.

![](/img/how-to-guides/orderplacedversion.png)

### Step 2 - Adjusting the Header and Footer links of the Checkout pages

We now need to update the links presented in the Header and Footer of the Checkout pages, guaranteeing that all links point to your FastStore website. To do that, take the following steps.

1. Still in the VTEX Admin at the **Store Setup > Checkout > Default > Code** tab, click on `checkout-footer.js` under **Files**. 
2. Edit the `checkout-header.js` code according to your scenario, making sure all links are pointing to your FastStore website. For example:

    ```diff title="checkout-header.js"
    <div class="container">
    -  <a href="/" title="Home Page">Your logo here!</a>
    +  <a href="https://vtexfaststore.com" title="Home Page">FastStore</a>
    <hr>
    </div>
    ```

3. Click on **Save**. Notice that, as soon as you hit the *Save* button, your changes will be live to all clients.

Once you adjust all the Header links of the Checkout pages, make sure to repeat this process for the `checkout-footer.js` file to adjust the Checkout Footer.


