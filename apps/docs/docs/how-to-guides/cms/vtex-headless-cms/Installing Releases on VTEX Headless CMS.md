# Installing Releases on VTEX Headless CMS

**VTEX Headless CMS 1.x** requires the VTEX **Releases** app to function. Releases is a VTEX module that allows merchants to publish and schedule content changes in their stores. To use it along with the VTEX Headless CMS, take the following steps.

---

## Before you start

To complete this guide, you must have the VTEX IO CLI installed in your machine. For more information, please refer to this [document](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-install).

---

## Step by step

### Step 1 - Setting up the Releases app

1. Open the terminal and log in to your VTEX account.
   - _Replace the value between curly braces according to your scenario._

```
vtex login {account}
```

2. Upgrade the Admin CMS app to 1.x by running the following command:

   ```
   vtex install admin-cms@1.x admin-cms-graphql-rc@1.x
   ```

3. Install the Admin Releases app:

   ```
   vtex install vtex.admin-releases@0.x
   ```

4. Create a file named `cms-webhook-urls.json` in the root folder of your repository with the following content:
   ```json title="cms-webhook-urls.json"
   {
     "urls": [
       "https://{workspace}--{account}.myvtex.com/cms-releases/webhook-releases"
     ]
   }
   ```

### Step 2 - Updating the VTEX Headless CMS settings

1. Open the VTEX Admin.
2. Go to **Account Settings > Apps > My apps**.
3. Look for the **CMS (alpha)** app and click on **Settings**.
4. Update the **Build Webhook** URL value with the releases URL (`https://app.io.vtex.com/vtex.cms-builder-sf-jamstack/v1/{ACCOUNT}/{WORKSPACE}/build-releases`) as shown in the image below.
   ![Build Webhook Url Example](https://vtexhelp.vtexassets.com/assets/docs/src/releases-cms___b94b78c7fdb4dc7015839eccd9f534ce.png)

### Step 3 - Recovering data

When upgrading the VTEX Headless CMS, the data saved in the account will be lost. To recover your account data, follow the steps below.

1. On the Admin, go to the CMS `0.x` **Settings** (`https://{workspace}--{account}.myvtex.com/admin/apps/vtex.admin-cms-graphql-rc@0.x/setup/`) and copy all your definitions (e.g., Builder ID, Build Webhook URL, etc.).
2. Now, go to the CMS `1.x` **Settings** (`https://{workspace}--{account}.myvtex.com/admin/apps/vtex.admin-cms-graphql-rc@1.x/setup/`) and paste the values previously copied accordingly.
3. Open the terminal and change to your FastStore project repository.
4. Run `vtex cms sync` to sync your Sections, Content Types, and Translation Keys with the VTEX Headless CMS 1.x.

:::info
If you are using `gatsby-plugin-cms` (check your `package.json` file), you will also need to install the `vtex.graphql-gateway@1.0.1-hkignore.0` app. For more information, please refer to the [Migrating from gatsby-plugin-cms to gatsby-source-cms](/how-to-guides/cms/vtex-headless-cms/Migrating%20from%20gatsby-plugin-cms%20to%20gatsby-source-cms) guide.
:::
