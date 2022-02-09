# Implementing the VTEX OrderPlaced and MyAccount



**OrderPlaced** is a VTEX app that comes installed in every VTEX account

---

## Before you start

Before proceeding any further, make sure you already have:
- [Hosted your FastStore + VTEX website on the internet](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website).
- Installed the VTEX IO CLI on your machine.
- Installed the `vtex.edition-store` `3.x` or greater app version on your VTEX account. 
  - *Run `vtex edition get` to check if the `vtex.edition-store` app is installed on your account. If not, open a support ticket communicating you need to install the `vtex.edition-store@3.x` on your account to integrate your store with the VTEX platform.*

---

## Step by step

### Step 1 - Setting up the OrderPlaced page

In this step by step, you must ensure that clients are redirected to the newest **OrderPlaced** available.  

1. Access the **VTEX Admin**.
2. Go to **Store Setup > Checkout**.
3. Click on the **gear button** <img class="inline w-8" src="/img/how-to-guides/gear-button.png"/> in the **Default** card.
4. Change to the `Code` tab. 
5. Select `checkout-confirmation-custom.js` under **Files**. 
6. Add the following JavaScript code in the editor:

  ```jsx {4-5} title="checkout-confirmation-custom.js"
  // WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE.
  // THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.

  const og = new URLSearchParams(location.search).get('og')
  window.location.assign(`${window.location.origin}/api/io${window.location.pathname}?og=${og}`)
  ```
    
7. Click on **Save**. Notice that, as soon as you hit the *Save* button, your changes will be live to all clients.

### Step 2 - Creating the OrderPlaced and MyAccount pages

In this part of this guide, you'll use VTEX IO - a VTEX solution to create VTEX apps. But don't worry, you won't need to dive into VTEX IO concepts to complete the following steps.

#### Creating your app 

1. Open the terminal and log in to your VTEX account.
   - *Replace the value between curly brackets with the name of your account.*
   ```sh
   vtex login {account}
   ```
2. Create a new development workspace.
   ```sh
   vtex workspace use faststoreIntegrations
   ```   
3. Clone the [`faststore-integrations`](https://github.com/vtex/faststore-integrations/) project into your local folders.
   ```sh
   npx degit https://github.com/vtex/faststore-integrations
   ```    
4. Open the `faststore-integrations` directory in any code editor of your preference.
5. Open the `manifest.json` file and update the value of the `vendor` field with the name of your VTEX account.
6. Link your app to sync your local changes with VTEX IO cloud development environment.
   ```sh
   vtex link
   ```  

#### Updating the store logo

1. Open a new browser window and access `https://{worskpace}--{account}.myvtex.com` to see your changes live.
2. Open the `store/blocks/header.jsonc` file and update the `title`, `href`, `url`, and `width` values of your store logo (`logo#desktop` and `logo#mobile`) according to your scenario:
  ```jsonc title="store/blocks/header.json" {4-7,13-16}
  ...
  "logo#desktop": {
    "props": {
      "title": "{altText}",
      "href": "https://{maindomain}",
      "url": "{logoUrl}",
      "width": "{widthValue}"
    }
  }
  ...
    "logo#mobile": {
    "props": {
      "title": "{altText}",
      "href": "https://{maindomain}",
      "url": "{logoUrl}",
      "width": "{widthValue}"
    }
  }
  ```
3. Save your changes.

#### Adjusting `my-account` links

1. Access your local workspace `https://{worskpace}--{account}.myvtex.com`, add items to your shopping cart and proceed to checkout. Place an order and check if you are being taken to the OrderPlaced page:

![Order Options block](/img/how-to-guides/op-order-options.png)

You will be presented with a few options regarding your new order:
- Update order
- My orders
- Cancel order

Each of these options is a button that takes the user to a page that's under the `/account` route (rendered by `vtex.my-account` app). To make sure users are taken to the correct pages, follow these steps.

1. Find the `"order-placed"` block definition and all of the blocks that are being used by its implementation;
3. Find the `op-order-options` block currently being used by your order-placed implementation. Notice that there might be a desktop and a mobile variant of this block;
4. Use the prop `myAccountPath` to tell the `op-order-options` block what's the correct route for your `/account`. If you followed the tutorial on how to integrate the `my-account` app into your FastStore store, the value for this prop should be `/api/io/account`.

#### Publishing your app

1. Release a new app version.
    ```
    vtex release major stable
    ```
2. Publish your app
  ```
  vtex publish
  ```
3. Create a production workspace.
  ```
  vtex use {workspace} --production
  ```
4. Install the candidate version indicating the app's exact version as in the following:
  ```
  vtex install {appvendor}.{appname}@{appversion}
  ```
5. Deploy
  ```
  vtex deploy {vendor}.{appname}@{appversion}
  ```  
6. Promote
   ```
   vtex workspace promote
   ```  

## Related resources   

- [MyAccount](https://github.com/vtex-apps/my-account)
- [OrderPlaced](https://github.com/vtex-apps/order-placed)
- [What is VTEX IO](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-what-is-vtex-io)
- [Creating a Development workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-creating-a-development-workspace)
- [Linking an app](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-linking-an-app)
- [Customizing the Header and Footer blocks by page](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-customizing-the-header-and-footer-blocks-by-page)
- [Creating a Production workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-creating-a-production-workspace)
- [Making your new app version publicly available](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-making-your-new-app-version-publicly-available)
