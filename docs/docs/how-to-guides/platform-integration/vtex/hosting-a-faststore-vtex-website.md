---
title: Hosting a FastStore + VTEX website
sidebar_position: 1
---

In this guide, you will learn how to integrate your **FastStore** storefront project with **VTEX** and how to make it publicly available to end-users. Besides that, you'll have the VTEX Checkout functioning by the end of this guide.

Notice that we strongly recommend taking this guide as a first step when integrating your storefront project with VTEX. This way, by the end of this guide, you will be able to continue configuring other VTEX solutions (**Order Placed**, **Login**, and **My Account**) and check them working in production as you integrate them with your project.

---

## Before you start

Before proceeding any further, make sure you have access to a **VTEX** account and have already [developed your storefront project with **FastStore**.](/tutorials/gatsby-overview)

---

## Step by step

By the end of these steps, you'll host your FastStore website on the internet. Hence, if you'll configure other VTEX solutions (**Order Placed**, **Login**, and **My Account**) afterward, make sure to use a fictitious domain in the following steps. Then, once you set up all the desired integrations, repeat this guide procedure using your final domain to make your website publicly available to end-users.

### Step 1 - Configuring your website domain

To make your website publicly available, you need to configure a domain that points to the IP address where your store is hosted. 

:::info
To see which IP address corresponds to your store website (`{account}.vtex.app`), use the `nslookup` command as in the following:

1. Open the terminal.
2. Enter `nslookup {account}.vtex.app` (e.g., `nslookup base.vtex.app`).
3. Hit Enter. 

Now look below the `Non-authoritative answer` message to see the IP addresses capable of hosting your website. 
:::

You must also add a subdomain called `secure` pointing to `{account}.vtexcommercestable.com.br`. This will allow the **Checkout**, **Order Placed**, **Login**, and **My Account** pages to work under that subdomain.

Notice that depending on which domain provider you use, the steps to configure your website domain may vary. *See the documentation of your domain provider for more information.*

### Step 2 - Setting up your VTEX account

Now you must set up your VTEX account to use the domains you configured in the previous step. To proceed, make sure your store is active and in production.

1. Access the VTEX Admin.
2. Go to **Account Settings > Account Management > Account**.
3. Under the **Store** section, click on **Add new host**.
4. Add both your main domain and subdomain to the list.
   ![Host configuration](/img/how-to-guides/license-manager-hosts.png)
5. Click on **Save**.

### Step 3 - Updating your FastStore project

Back to your FastStore project, you must also configure your project to point to the right addresses and domains.

1. Open your FastStore project in any code editor of your preference.
2. Open the `store.config.js` file.
4. Update the `storeUrl`, `secureSubdomain`, `checkoutUrl`, `loginUrl`, and `accountUrl` properties as in the following:
   - **`storeUrl`**: https://{maindomain}
   - **`secureSubdomain`**: https://{subdomain}.{maindomain}
   - **`checkoutUrl`**: https://{subdomain}.{maindomain}/checkout
   - **`loginUrl`**: https://{subdomain}.{maindomain}/api/io/login
   - **`accountUrl`**: https://{subdomain}.{maindomain}/api/io/account
   Take the follwoing example of how this code block would look after configuring a store with the main domain as `vtexfaststore.com` and subdomain `secure`:

   ```diff title="store.config.js"
      ...

      // Default channel
      channel: '1',

   +  // Production URLs
   +  storeUrl: 'https://vtexfaststore.com',
   +  secureSubdomain: 'https://secure.vtexfaststore.com',
   +  checkoutUrl: 'https://secure.vtexfaststore.com/checkout',
   +  loginUrl: 'https://secure.vtexfaststore.com/api/io/login',
   +  accountUrl: 'https://secure.vtexfaststore.com/api/io/account',

      // Lighthouse CI
      lighthouse: {
      ...
   ```

5. Save your changes.
6. Open a Pull Request and commit your changes.

---

## Next steps

To provide shoppers with a full checkout and post-purchase experience, make sure to check the following documents:

1. [Integrating your FastStore project with VTEX Login](/how-to-guides/platform-integration/vtex/integrating-the-vtex-login).
2. [Integrating your FastStore project with VTEX Checkout](/how-to-guides/platform-integration/vtex/integrating-vtex-checkout).
3. [Integrating your FastStore project with VTEX Order Placed and My Account](/how-to-guides/platform-integration/vtex/integrating-vtex-orderplaced-myaccount).
