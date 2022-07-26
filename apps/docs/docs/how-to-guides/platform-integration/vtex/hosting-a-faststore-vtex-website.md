---
sidebar_position: 2
title: "Part 2: Configuring external DNS for a custom domain"
sidebar_label: "2. Configuring external DNS"
pagination_label: Part 2
---

To use an **external domain** for your **FastStore + VTEX** website, you'll need to:

 - Set up your external DNS provider to point your custom domain to your VTEX website. Custom domains can be purchased from any **domain registrar**.
 - Configure your custom domains in **VTEX Account Management**.
 - Associate your custom domains with your **FastStore** project. 

Besides making your FastStore website accessible via a custom domain, the **VTEX Checkout** will also be operational as soon as you complete this guide. You'll then be ready to continue configuring other VTEX solutions, such as **Order Placed**, **Login**, and **My Account**.

---

## Before you start

- [Set up your **VTEX** account.](/how-to-guides/platform-integration/vtex/setting-up-an-account)
- Develop your FastStore project with **Gatsby 4 or Next.js**. If you have already started with **Gatsby 3**, please contact [**VTEX Support**](https://help.vtex.com/en/support) before proceeding to the next steps.
- Deploy your FastStore project.
- Buy the desired domain.
- [Redirect the **root domain** to the `www` subdomain.](https://help.vtex.com/en/tutorial/configuring-access-without-www--tutorials_4278#root-domain-redirect-without-www)

---

## Step by step

:::caution
If you still need to configure other VTEX solutions, please **use a fictitious domain name** while taking the following steps. Then, once you set up all the desired integrations, repeat this guide using your final domain to make your website publicly available to end-users.
:::

### Step 1 - Creating the DNS records

1. Access your domain provider website.
2. Create a **CNAME** DNS record for your www domain (e.g., `www.mystore.com`) that points to `www.{rootDomain}.com.cdn.vtex.com` (e.g., `www.mystore.com.cdn.vtex.com`). _Check the documentation of your domain provider for more information._
3. Now, create a **CNAME** record for the `secure` subdomain (e.g., `secure.mystore.com`) that points to `secure.{rootDomain}.cdn.vtex.com` (e.g., `secure.mystore.com.cdn.vtex.com`). This subdomain will be used by the **Checkout**, **Order Placed**, **Login**, and **My Account** pages.

:::info
Notice that the configured addresses may not be immediately available to everyone since DNS pointing propagation takes 24-48 hours to occur completely.
:::

### Step 2 - Configuring domains in VTEX Account Management

Now you must set up your VTEX account to use the DNS records created in the previous step. To proceed, make sure your store [is active and in production](https://help.vtex.com/en/tutorial/passando-a-loja-para-producao/).

1. Access the VTEX Admin.
2. Go to **Account Settings > Account Management > Account**.
3. Under the **Store** section, click the **Add new host** button.
4. Add your main domain (e.g., `mystore.com`) to the list.
5. Click the **Add new host** button.
6. Add the `secure` subdomain (e.g., `secure.mystore.com`) to the list.
   ![Host configuration](https://vtexhelp.vtexassets.com/assets/docs/src/hostsConfig___cad00ec89023cd77c34f77898cda1b3e.png)
7. Click the **Save** button.

### Step 3 - Associating your custom domain with your FastStore project

Back to your FastStore project, you must also configure your project to point to the right addresses and domains.

1. Open your FastStore project in any code editor of your preference.
2. Open the `store.config.js` file.
3. Update the `storeUrl`, `secureSubdomain`, `checkoutUrl`, `loginUrl`, and `accountUrl` properties as in the following:

   - **`storeUrl`**: `https://{rootDomain}`
   - **`secureSubdomain`**: `https://{subdomain}.{rootDomain}`
   - **`checkoutUrl`**: `https://{subdomain}.{rootDomain}/checkout`
   - **`loginUrl`**: `https://{subdomain}.{rootDomain}/api/io/login`
   - **`accountUrl`**: `https://{subdomain}.{rootDomain}/api/io/account`
     Take the following example of how this code block would look after configuring a store with the `mystore.com` domain and `secure` subdomain:

   ```diff title="store.config.js"
      ...

      // Default channel
      channel: '1',

   +  // Production URLs
   +  storeUrl: 'https://mystore.com',
   +  secureSubdomain: 'https://secure.mystore.com',
   +  checkoutUrl: 'https://secure.mystore.com/checkout',
   +  loginUrl: 'https://secure.mystore.com/api/io/login',
   +  accountUrl: 'https://secure.mystore.com/api/io/account',

      // Lighthouse CI
      lighthouse: {
      ...
   ```
4. Save your changes.
5. Open the `vtex.env` file.
6. Add the `SITE_HOST` key with the main domain specified in VTEX Account Management (step 2) as the value.
   
   ```diff title="vtex.env"
   + SITE_HOST=mystore.com
   ```

7. Save your changes.
8. Open a Pull Request, commit your changes, and deploy them to `main`/`master`.

### Step 4 - Configuring the CDN workflow (Only for new go-lives)

If your FastStore website is going live for the first time, [open a ticket with VTEX Support](https://help.vtex.com/en/support) and specify that you need to configure the CDN workflow for the secure and main domains of your store. Remember to include the following information in your ticket:

- The account **name**.
- The **secure** and **main** domains of your store.

The VTEX team will evaluate your request and take the necessary actions to configure the CDN workflow for your account.

---

## Related resources

- [Setting up DNS pointing to VTEX](https://help.vtex.com/en/tutorial/configuring-dns-pointing-to-vtex--tutorials_4280)
- [How to insert a reverse proxy in front of VTEX services](https://help.vtex.com/en/tutorial/how-to-insert-a-reverse-proxy-in-front-of-vtex-services)
