
## How to integrate FastStore with VTEX

FastStore can be integrated with VTEX to provide a great checkout and post purchase experience. Follow the steps below to know how.

## Step 1 - Configure your website domain

To have a publicly available website, you need to configure a domain that points to where your store is hosted. You can do that in a variety of ways, depending on which domain provider you use. You should point your domain to the IP address corresponding to the `{account}.vtex.app` website. You can see which IP corresponds to that address using the `nslookup` command.

Example: type `nslookup base.vtex.app` into your terminal and hit Enter. Now look below the "Non-authorative answer" message to see several IP addresses capable of hosting your website. 

## Step 2 - Configure you VTEX integration subdomain

Add a subdomain called `secure` and point it to `{account}.vtexcommercestable.com.br`. This will allow the checkout, order placed, login and my account pages to work under that subdomain.

## Step 3 - Change your store settings on VTEX Admin

Access the VTEX Admin of your store and search for your account settings or go directly to the page at `{account}.myvtex.com/admin/license-manager/#/account-details`. Under the Store section, click on "Add new host" and add both you main domain and your VTEX integration subdomain to the list and click Save.

![Host configuration](/img/how-to-guides/license-manager-hosts.png)

:::info
Your store has to be active and in production for your VTEX integration to work.
:::

## Step 4 - Update your `store.config.js` file

Configure your store so that it points to the right addresses. In the `store.config.js` file, change the `storeUrl` property so that it points to your main domain and change the `secureSubdomain`, `checkoutUrl`, `loginUrl`, and `accountUrl` property so that they match `https://{subdomain}.{maindomain}`, `https://{subdomain}.{maindomain}/checkout`, `https://{subdomain}.{maindomain}/api/io/login`, and `https://{subdomain}.{maindomain}/api/io/account` respectively.

Here's an example of how this code block would look after configuring a store with main domain as `vtexfaststore.com` and subdomain `secure`:

```js
  // Production URLs
  storeUrl: 'https://vtexfaststore.com',
  secureSubdomain: 'https://secure.vtexfaststore.com',
  checkoutUrl: 'https://secure.vtexfaststore.com/checkout',
  loginUrl: 'https://secure.vtexfaststore.com/api/io/login',
  accountUrl: 'https://secure.vtexfaststore.com/api/io/account',
```