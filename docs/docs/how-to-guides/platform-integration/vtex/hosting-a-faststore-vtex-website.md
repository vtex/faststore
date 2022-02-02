---
title: Hosting a FastStore + VTEX website
---

In this guide, you will learn how to integrate your FastStore storefront project with VTEX and how to make it publicly available to end-users.

By the end of this guide, you will be able to provide shoppers with a full checkout and post-purchase experience.

## Before you start

Before proceeding any further, make sure you already have:

1. [Developed your storefront project with FastStore.](/tutorials/gatsby-overview)
2. Integrated your FastStore project with VTEX Login (*Docs coming soon*).
3. Integrated your FastStore project with VTEX Order Placed (*Docs coming soon*).
3. Integrated your FastStore project with VTEX Checkout (*Docs coming soon*).
3. Integrated your FastStore project with VTEX My Account (*Docs coming soon*).

## Step by step

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