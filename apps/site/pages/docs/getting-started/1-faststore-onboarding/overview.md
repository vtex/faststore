---
title: ' Overview'
sidebar_label: 'one-faststore-onboarding'
---

import { Callout, Tab, Tabs } from 'nextra-theme-docs'

<header>

# Overview

</header>

<Callout type="warning" emoji="⚠️">
  This documentation is currently under development.
</Callout>

FastStore Onboarding app is a specialized tool designed to simplify the process of setting up a store, allowing you to focus on building your storefront without the hassle of complex configurations.

## Before you start
**1. Ensure that you have installed the VTEX IO CLI on your machine.** For more information, please refer to [this guide](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference).

---

**2. To develop a storefront in FastStore, your account edition needs to be `vtex.edition-store@5.x`.** If you are using a major version above `5.x`, make sure to install all the apps related to the [VTEX Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search). 

<Tabs items={['To check your account edition', 'To install apps related to VTEX Intelligent Search']}>
  <Tab>
      - Using the VTEX IO CLI, login to the VTEX store account by running `vtex login {account-name}` in the terminal. 
      - run `vtex edition get` to display the Edition App version installed on the current account.
  </Tab>
  <Tab>
     In the terminal, install the following apps:
    ```bash
      vtex install vtex.admin-search@1.x vtex.admin-cms@1.x vtex.messages@1.x vtex.cms-builder-sf-jamstack@1.x vtex.intelligent-search-api@0.x
    ```
  </Tab>
</Tabs>
---
**3. The FastStore Onboarding app must be installed in your store account.** To request the installation of the app, please open a ticket with the [VTEX support team](https://help.vtex.com/support).

## Accessing the FastStore Onboarding app

To access the app, go to the VTEX Admin and navigate to **Apps > Installed Apps > FastStore**.
Take a look on the app's page overview and its available options

![onboarding-overview](https://vtexhelp.vtexassets.com/assets/docs/src/onboarding-welcome___6f555fad8cf8cca100aebbddcc04c950.png)

| Option                  | Description                                                                                                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FastStore Documentation | Access the FastStore Portal Documentation.                                                                                                                                                                                              |
| View Live Demo          | Previews a live demo store.                                                                                                                                                                                                             |
| Before you start        | Opens a sidebar with FAQs about starting the project. Note that you have the option to create a catalog for your store if you haven't already. By clicking on `Create Catalog`, you will be taken to the Catalog section in the Admin.  |
| Start Project           | Opens the first page to start creating a new FastStore project.                                                                                                                                                                         |