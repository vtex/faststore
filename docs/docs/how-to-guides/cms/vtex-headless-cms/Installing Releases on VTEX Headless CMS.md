# Installing Releases on VTEX Headless CMS
Releases is a module used to publish and schedule content. To have it installed on CMS to use this module by default, follow the steps below.
## Step by step
You are able to set up your releases for CMS by following the steps below.
### Step 1 - Setting up the Releases app
1. Open the terminal and log in to your VTEX account.
*Replace the value between curly braces according to your scenario.*
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
```json
{"urls":["https://{workspace}--{account}.myvtex.com/cms-releases/webhook-releases"] }
```
### Step 2 - Updating the VTEX Headless CMS settings
1. Open the VTEX Admin.
2. Go to Account **Settings > Apps > My apps**.
3. Look for the **CMS (alpha)** app and click on Settings.
4. Update the Build Webhook URL value with the releases URL (`https://app.io.vtex.com/vtex.cms-builder-sf-jamstack/v1/{ACCOUNT}/{WORKSPACE}/build-releases`) as shown in the image below.
![Build Webhook Url Example](https://vtexhelp.vtexassets.com/assets/docs/src/releases-cms___b94b78c7fdb4dc7015839eccd9f534ce.png)
### Step 3 - Recovering data
When upgrading the VTEX Headless CMS, the data saved in the account will be lost. To recover your account data, follow the steps below.
1. Go to app settings and copy the info added for `0.x` to the new `1.x `installation.
2. Copy the following information from your previous setup:
`https://{workspace}--{account}.myvtex.com/admin/apps/vtex.admin-cms-graphql-rc@0.x/setup/`
3. Paste the following URL in the new setup:
`https://{workspace}--{account}.myvtex.com/admin/apps/vtex.admin-cms-graphql-rc@1.x/setup/`
You can also do a `vtex-cms` sync to install sections, content-types and translations automatically without copying by following the steps on [Setting up the VTEX Headless CMS in your FastStore project](/tutorials/cms/2).
:::info
If you are using `gatsby-plugin-cms` (check your `package.json` file), you will need to install `vtex.graphql-gateway@1.0.1-hkignore.0` to fix the queries to the GraphQL API (deprecated). Read the tutorial Migrating from gatsby-plugin-cms to gatsby-source-cms for more information.
:::









