---
title: Hosting a FastStore + VTEX website
sidebar_position: 2
---

This guide is the first step to integrating your storefront project with VTEX. You will learn how to make your **FastStore** project publicly available on the internet and have the VTEX Checkout functioning. After completing it, you'll be able to continue configuring other VTEX solutions, such as **Order Placed**, **Login**, and **My Account**.

---

## Before you start

Before proceeding any further, make sure you have [set up your **VTEX** account](/how-to-guides/platform-integration/vtex/setting-up-an-account) and have already deployed your FastStore project.

---

## Step by step

### Step 1 - Getting the IP address of your website

Use the `nslookup` command as in the following to check which **IP address** corresponds to your store website:

1. Open the terminal.
2. Check which IP addresses are capable of hosting your website by running the following command:

- Remember to replace `{URL}` with your automatic deployment URL (e.g., `base.vtex.app`, `base.netlify.app`, `base.vercel.app`).

```
nslookup {URL}
```

4. Copy and save one of the IP addresses presented below the `Non-authoritative answer` message for further usage.

![Getting the IP address of your website via the terminal](https://vtexhelp.vtexassets.com/assets/docs/src/nslookup___388da0c4d31ac04a2979dd6435107f93.png)

### Step 2 - Configuring your website domain

Now, it's time to make your website publicly available on the internet.

:::caution
If you still need to configure other VTEX solutions, please **use a fictitious domain name** when taking the following steps. Then, once you set up all the desired integrations, repeat this guide using your final domain to make your website publicly available to end-users.
:::

1. Access your domain provider website.
2. Configure a **domain name** (for example, `vtexfaststore.com`) that points to the **IP address** you saved in the previous step. _Check the documentation of your domain provider for more information._
3. Now, configure a **subdomain** named `secure` that points to `secure.{rootDomain}.cdn.vtex.com`, where `{rootDomain}` is the **complete** address of your website. For example, `secure.vtexfaststore.com.cdn.vtex.com`. This subdomain will be used by the **Checkout**, **Order Placed**, **Login**, and **My Account** pages.

### Step 3 - Setting up your VTEX account

Now you must set up your VTEX account to use the domains you configured in the previous step. To proceed, make sure your store is active and in production.

1. Access the VTEX Admin.
2. Go to **Account Settings > Account Management > Account**.
3. Under the **Store** section, click on **Add new host**.
4. Add both your main domain and subdomain to the list.
   ![Host configuration](https://vtexhelp.vtexassets.com/assets/docs/src/hosts___3216b64d96830adf523a9c8bfdf02dab.png)
5. Click on **Save**.

### Step 4 - Updating your FastStore project

Back to your FastStore project, you must also configure your project to point to the right addresses and domains.

1. Open your FastStore project in any code editor of your preference.
2. Open the `store.config.js` file.
3. Update the `storeUrl`, `secureSubdomain`, `checkoutUrl`, `loginUrl`, and `accountUrl` properties as in the following:

   - **`storeUrl`**: https://{rootDomain}
   - **`secureSubdomain`**: https://{subdomain}.{rootDomain}
   - **`checkoutUrl`**: https://{subdomain}.{rootDomain}/checkout
   - **`loginUrl`**: https://{subdomain}.{rootDomain}/api/io/login
   - **`accountUrl`**: https://{subdomain}.{rootDomain}/api/io/account
     Take the follwoing example of how this code block would look after configuring a store with the `vtexfaststore.com` root domain and `secure` subdomain:

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

4. Save your changes.
5. Open a Pull Request and commit your changes.

---

## Next steps

To provide shoppers with a full checkout and post-purchase experience, make sure to check the following documents:

1. [Integrating your FastStore project with VTEX Login](/how-to-guides/platform-integration/vtex/integrating-the-vtex-login).
2. [Integrating your FastStore project with VTEX Checkout](/how-to-guides/platform-integration/vtex/integrating-vtex-checkout).
3. [Integrating your FastStore project with VTEX Order Placed and My Account](/how-to-guides/platform-integration/vtex/integrating-vtex-orderplaced-myaccount).

---

## Related resources

- [Setting up DNS pointing to VTEX](https://help.vtex.com/en/tutorial/configuring-dns-pointing-to-vtex--tutorials_4280)
- [How to insert a reverse proxy in front of VTEX services](https://help.vtex.com/en/tutorial/how-to-insert-a-reverse-proxy-in-front-of-vtex-services)
