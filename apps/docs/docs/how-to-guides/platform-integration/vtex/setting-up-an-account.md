---
description: Set up your VTEX environment and install all the necessary apps to start developing with FastStore
sidebar_position: 1
title: "Part 1: Setting up a VTEX account for FastStore"
sidebar_label: "1. Setting up a VTEX account for FastStore"
pagination_label: Part 1
---

This guide is the first step in developing a **FastStore** website integrated with the **VTEX** Platform. In the following section, you will set up your VTEX environment and install all the necessary apps to start developing with FastStore.

Notice that you must complete the following steps before developing your storefront or configuring your website DNS because needed dependencies, such as [VTEX Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search), will be installed and configured throughout this process.

---

## Before you start

Before proceeding any further, make sure you have:

- Access to a **VTEX** account.
- The **VTEX IO CLI** installed on your machine. Please refer to [this guide](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference) for more information.

---

## Step by step

In this step by step, you'll use the FastStore plugin for the VTEX IO CLI to install, with a single command, all dependencies needed for developing a FastStore website.

1. Install the FastStore plugin for the VTEX IO CLI:

   ```
   vtex plugins install faststore
   ```

2. Log in to your VTEX account:

   - _Remember to replace the values between curly brackets according to your scenario._

   ```
   vtex login {account}
   ```

3. Set up your VTEX account for FastStore by running the following command:

   ```
   vtex faststore setup
   ```

Once the command completes, you should see the following message: `Happy coding on FastStore 🎉`.