---
id: 1
sidebar_label: "1. Configuring your VTEX account"
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

   ```
   vtex login {account}
   ```
  
  :::caution
  Remember to replace the values between curly brackets according to your scenario.
  :::

3. Install the VTEX Headless CMS plugin:

    ```sh
    vtex plugins install cms
    ```

Now, check if the installation of the VTEX Headless CMS plugin was successful and take a look at all the `cms` subcommands by running `vtex cms`.

   ![VTEX Headless CMS plugin](/img/tutorials/cms/cms-cli-plugin.png)


### Step 2 - Installing the Headless CMS app on your VTEX account

In this step, let's install install the VTEX Headless CMS app and all its dependencies in your VTEX account by running the following command:

  ```
  vtex install vtex.admin-cms@0.x vtex.admin-cms-graphql@0.x vtex.admin-cms-graphql-rc@0.x vtex.admin-releases@0.x vtex.cms-builder-sf-jamstack@1.x
  ```

Now you can check the VTEX Headless CMS interface by accessing the VTEX Admin and then going to **Store Setup > CMS (Alpha) > Pages (Alpha)**.

### Step 3 - Configuring the VTEX Headless CMS

Next, let's configure the URLs of the webhooks used by the VTEX Headless CMS app.

1. Access the **VTEX Admin.**
2. Go to **Account Settings > Apps > My apps.**
3. Look for the **CMS (alpha)** app and click on **Settings.**
4. Select **Add More**.
5.  Fill in the **Builder ID** field with `faststore`.
6. Fill in the **Build Webhook URL** field with the following value. *Replace the values between curly brackets according to your scenario.*
   ```
   https://app.io.vtex.com/vtex.cms-builder-sf-jamstack/v1/{account}/{workspace}/build
   ```

   :::info
   When an editor clicks to publish a page using the VTEX Headless CMS interface, the CMS calls the **Build Webhook URL**, which changes the status of that page to `publishing`. The CMS, then, waits for the content to be built in the background.
   :::

7. Now, fill in the **Production base URL** filed with the following value. *Replace the values between curly brackets according to your scenario.*
  ```
  https://{account}.vtex.com/
  ```
   
8. Click on **Save.**

![CMS Settings](/img/tutorials/cms/cms-settings.png)

Now you're ready to start defining which Content Types and Sections will be editable via the VTEX Headless CMS. Let's get started!

---

## Related resources

- [VTEX IO CLI](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference)
