---
sidebar_position: 3
toc_max_heading_level: 4
---

# Implementing VTEX Order Placed and My Account

To create a complete digital commerce experience for your FastStore project, you need to provide shoppers with a Checkout and My Account space, for example. In this guide, we'll teach you how to implement the **Order Placed** page, which displays a successful message right after the checkout process is completed, and a **My Account** space, which allows customers to manage their orders and personal data (e.g., profile info, password, addresses, and credit cards) on a single page. 

Notice that, since we're using a subdomain unrelated to FastStore itself for these integrations, we'll use VTEX IO in this guide. VTEX IO is a VTEX solution to create VTEX apps. But don't worry: to finish this guide, you won't need to dive into VTEX IO concepts.

---

## Before you start

Before proceeding any further, make sure you already have:
- The VTEX IO CLI installed on your machine.
- [Your FastStore + VTEX website hosted on the internet](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website).
- The `vtex.edition-store` `3.x` or greater app version installed on your VTEX account. 
  - *Run `vtex edition get` to check if the `vtex.edition-store` app is installed on your account. If not, [open a support ticket](https://help.vtex.com/en/support) communicating you need the `vtex.edition-store@3.x` to be installed on your account so you can integrate your FastStore project with the VTEX platform.*

---

## Step by step

### Step 1 - Setting up the Order Placed page

Take the following steps to guarantee shoppers will be redirected to the newest version of the **Order Placed** page in your store:

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

![](/img/how-to-guides/orderplacedversion.png)

### Step 2 - Creating the Order Placed and My Account pages

Now, let's set up the Order Placed and My Account apps using VTEX IO - a VTEX solution to create VTEX apps. But don't worry: you won't need to dive into VTEX IO concepts to complete the following steps.

#### Creating your app 

1. Open the terminal and clone the [`faststore-vtex-integrations`](https://github.com/vtex/faststore-vtex-integrations/) project into your local files.
   ```sh
   npx degit vtex/faststore-vtex-integrations
   ```    
2. Open the `faststore-vtex-integrations` directory in any code editor of your preference.
3. Open the `manifest.json` file and update the value of the `vendor` field with the name of your VTEX account.
4. Using the terminal, log in to your VTEX account.

   ```sh
   vtex login {account}
   ```

  :::caution
  Replace the value between curly brackets with the name of your account.
  :::

5. Create a new development workspace.
   ```sh
   vtex workspace use {workspace}
   ```   
  :::caution
  Replace the value between curly brackets with any name of your preference, making sure the name you choose is not already taken.
  :::
     
   Enter `Y` to continue creating the new workspace.
6. Link your app to sync your local changes with the VTEX IO cloud development environment.
   ```sh
   vtex link
   ```  

7. Now, open a new browser window and access `https://{workspace}--{account}.myvtex.com` to see your changes live. *Remember to replace the values between curly brackets according to your scenario.*
8. Add items to your shopping cart and proceed to checkout. Place an order and observe if you are being taken to the Order Placed page:

  ![Order Placed page](/img/how-to-guides/order-placed-page.png)

#### Updating the store logo

After accessing the Order Placed page, you probably noticed the FastStore logo. Let's update it, so the **Order Placed** and **My Account** pages are presented with your store logo.

1. Save your logo inside the `assets` folder.
2. Open the `store/blocks/header.jsonc` file and update the `title`, `href`, `url`, and `width` values of your store logo (`logo#desktop` and `logo#mobile`) according to your scenario:
  ```jsonc title="store/blocks/header.json" {4-7,13-16}
  ...
  "logo#desktop": {
    "props": {
      "title": "{altText}",
      "href": "https://{maindomain}",
      "url": "assets/{logoPath}",
      "width": "{widthValue}"
    }
  }
  ...
    "logo#mobile": {
    "props": {
      "title": "{altText}",
      "href": "https://{maindomain}",
      "url": "assets/{logoPath}",
      "width": "{widthValue}"
    }
  }
  ```
3. Save your changes.

#### (Optional) Styling the Order Placed and My Account header

If you want to change the style of the header presented in the **Order Placed** and **My Account** pages, you can update the `vtex.flex-layout.css` and `vtex.store-header.css` files contained in the `styles/css` folder. For more info, please refer to [this](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-using-css-handles-for-store-customization) guide.

#### Publishing your app

Now that everything is as expected, you need to make your changes publicly available to your store shoppers. To do that, take the following steps:

1. Open the terminal and create a production workspace.
  ```
  vtex use {workspace} --production
  ```
2. Change to the `faststore-vtex-integrations` directory.
3. Release a new app version.
  ```
  vtex release major stable
  ```
3. Publish your app as a candidate version.
  ```
  vtex publish
  ```
4. Install the candidate version indicating the app's version as in the following:
  ```
  vtex install {vendor}.{name}@{version}
  ```
  :::caution
  Replace the values between curly brackets according to the `manifest.json` file of your `faststore-vtex-integrations` app.
  :::
5. Deploy the candidate version as a stable version.
  ```
  vtex deploy {vendor}.{appname}@{appversion}
  ```  
6. Promote your Production workspace to master to make your changes publicly available to your store shoppers.
   ```
   vtex workspace promote
   ```  

That's all. Now, if you place an order in your store, you'll be presented with the **Order Placed** page. Similarly, you'll also have access to the **My Account** page.

## Related resources   

- [My Account](https://github.com/vtex-apps/my-account)
- [Order Placed](https://github.com/vtex-apps/order-placed)
- [What is VTEX IO](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-what-is-vtex-io)
- [Creating a Development workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-creating-a-development-workspace)
- [Linking an app](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-linking-an-app)
- [Using CSS Handles for store customization](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-using-css-handles-for-store-customization)
- [Creating a Production workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-creating-a-production-workspace)
- [Making your new app version publicly available](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-making-your-new-app-version-publicly-available)
