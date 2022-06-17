---
id: 1
description: Set up all the necessary tools to integrate your FastStore project with the VTEX Headless CMS.
sidebar_label: '1. Configuring your VTEX account'
pagination_label: Part 1
---

# Part 1: Configuring your VTEX account

## Introduction

To avoid any surprises during the course of this tutorial, let's first set up all the tools you will need to integrate the VTEX Headless CMS with your FastStore project.

First, we will install the **VTEX IO CLI**. The VTEX IO CLI will help you during your development process by allowing you to perform different actions in the VTEX platform. In the following, we will install and configure the VTEX Headless CMS app in your VTEX account.

---

## Step by step

### Step 1 - Setting up the command-line environment

1. Install the VTEX IO CLI on your machine. Please refer to [this](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-install) document for more information.

2. Log in to your VTEX account:

- _Remember to replace the values between curly brackets according to your scenario._

```
vtex login {account}
```

3. Install the VTEX Headless CMS plugin:

   ```sh
   vtex plugins install cms
   ```

Now, check if the installation of the VTEX Headless CMS plugin was successful by running `vtex cms`.

![VTEX Headless CMS plugin](https://vtexhelp.vtexassets.com/assets/docs/src/CMSPluginCLI___63a1f4d454fd5d42353d5ee276028962.png)

:::caution
If you find any problems while installing the plugin, please refer to our [Troubleshooting](/tutorials/cms/Troubleshooting) article.
:::

### Step 2 - Installing the Headless CMS app on your VTEX account

Install the VTEX Headless CMS app and all its dependencies in your VTEX account by running the following command:

```
vtex install vtex.admin-cms@1.x vtex.admin-cms-graphql@0.x vtex.admin-cms-graphql-rc@1.x vtex.admin-releases@0.x vtex.cms-builder-sf-jamstack@1.x
```

Now you can check the VTEX Headless CMS interface by accessing the VTEX Admin and then going to **Store Setup > CMS (Alpha) > Pages (Alpha)**.

### Step 3 - Configuring the Headless CMS

Next, let's configure the URLs of the webhooks used by the VTEX Headless CMS app.

1. Access the **VTEX Admin.**
2. Go to **Account Settings > Apps > My apps.**
3. Look for the **CMS (alpha)** app and click on **Settings.**
4. Select **Add More**.
5. Fill in the **Builder ID** field with `faststore`.
6. Fill in the **Build Webhook URL** field with the following value. _Replace the values between curly brackets according to your scenario._

   ```
   https://app.io.vtex.com/vtex.cms-builder-sf-jamstack/v1/{account}/{workspace}/build-releases
   ```

   :::info
   When an editor clicks to publish a page using the VTEX Headless CMS interface, the CMS calls the **Build Webhook URL**, which changes the status of that page to `publishing`. The CMS, then, waits for the content to be built in the background.
   :::

7. Now, fill in the **Production base URL** filed with the following value. _Replace the values between curly brackets according to your scenario._

```
https://{account}.vtex.com/
```

8. Click on **Save.**

![CMS Settings](https://vtexhelp.vtexassets.com/assets/docs/src/cms-settings2___54ec9a22584b5aad09d0b403993cbee2.png)

### Step 4 - Communicating WebOps updates to the Headless CMS

Now, if you are developing your FastStore project with WebOps and VTEX Headless CMS, you must ensure that WebOps is aware of every CMS update performed via the VTEX Admin. To do so, you must configure the WebOps webhooks responsible for communicating with the VTEX Headless CMS as in the following.

1. Open your FastStore project in any code editor of your preference.
2. Create the `cms-webhook-urls.json` file in the root directory of your project.
3. Add the webhooks corresponding to your store website as in the following:

   ```json title="cms-webhook-urls.json"
   {
     "urls": ["https://{account}.myvtex.com/cms-releases/webhook-releases"]
   }
   ```

   :::caution
   If applicable, specify the [production workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-workspace) you are using to develop your FastStore project in the webhook URL as in the following: `https://{workspace}--{account}.myvtex.com/cms-releases/webhook-releases`
   :::

4. Open a Pull Request including the previous changes.
5. Merge the Pull Request.

Now you're ready to start defining which Content Types and Sections will be editable via the VTEX Headless CMS. Let's get started!

---

## Related resources

- [VTEX IO CLI](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference)
