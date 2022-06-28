---
title: "Part 5: Integrating the VTEX Order Placed and My Account"
sidebar_label: "5. Integrating the VTEX Order Placed and My Account"
pagination_label: Part 5
sidebar_position: 5
---

To create a complete digital commerce experience for your FastStore project, you need to provide shoppers with a Checkout and My Account space, for example. In this guide, we'll teach you how to implement the **Order Placed** page, which displays a successful message right after the checkout process is completed, and a **My Account** space, which allows customers to manage their orders and personal data (e.g., profile info, password, addresses, and credit cards) on a single page.

Notice that, since we're using a subdomain for these integrations that is unrelated to FastStore itself, we'll use VTEX IO in this guide. VTEX IO is a VTEX solution to create VTEX apps. But don't worry: to finish this guide, you won't need to dive into VTEX IO concepts.

---

## Before you start

Before proceeding any further, make sure you already have:

- Integrated your FastStore project with the VTEX Checkout. See [this](/how-to-guides/platform-integration/vtex/integrating-vtex-checkout) doc for more info.
- The VTEX IO CLI installed on your machine. Please refer to [this](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference) documentation for more information.
- The `vtex.edition-store` `3.x` or greater app version installed on your VTEX account.
  - _Run `vtex edition get` to check if the `vtex.edition-store` app is installed on your account. If not, [open a support ticket](https://help.vtex.com/en/support) communicating you need the `vtex.edition-store@3.x` to be installed on your account so you can integrate your FastStore project with the VTEX platform._

---

## Step by step

### Step 1 - Creating your app

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

7. Now, open a new browser window and access `https://{workspace}--{account}.myvtex.com` to see your changes live. _Remember to replace the values between curly brackets according to your scenario._
8. Add items to your shopping cart and proceed to checkout. Place an order and observe if you are being taken to the Order Placed page:

![Order Placed page](https://vtexhelp.vtexassets.com/assets/docs/src/order-placed-page___1c8555354e041450be5fb90f7ba1f7d6.png)

### Step 2 - Updating the store logo

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

### Step 3 - (Optional) Styling the Order Placed and My Account header

If you want to change the style of the header presented in the **Order Placed** and **My Account** pages, you can update the `vtex.flex-layout.css` and `vtex.store-header.css` files contained in the `styles/css` folder. For more info, please refer to [this](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-using-css-handles-for-store-customization) guide.

### Step 4 - Publishing your app

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
::: 5. Deploy the candidate version as a stable version.

```
vtex deploy {vendor}.{appname}@{appversion}
```

6. Promote your Production workspace to master to make your changes publicly available to your store shoppers.
   ```
   vtex workspace promote
   ```

That's all. Now, if you place an order in your store, you'll be presented with the **Order Placed** page. Similarly, you'll also have access to the **My Account** page.

## Related resources

- [Creating a Development workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-creating-a-development-workspace)
- [Linking an app](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-linking-an-app)
- [Using CSS Handles for store customization](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-using-css-handles-for-store-customization)
- [Creating a Production workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-creating-a-production-workspace)
- [Making your new app version publicly available](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-making-your-new-app-version-publicly-available)
