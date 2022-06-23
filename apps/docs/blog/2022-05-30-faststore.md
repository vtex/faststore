---
description: Check the recent changes in the secure subdomain configuration.
tags: [faststore]
hide_table_of_contents: false
---

# Changes in the secure subdomain configuration

We've recently changed the configurations needed for the `secure` subdomain. Hence, if you come across the **"This connection is not private"** error while trying to complete an order at your store website, check if your website's secure subdomain is pointing to `secure.{hostname}.cdn.vtex.com`, where `{hostname}` is the **complete** address of your store.

![](https://vtexhelp.vtexassets.com/assets/docs/src/not-secure___d8621c4ec4766fde0206c32055a2975d.jpeg)

## What has changed?

The `secure` subdomain must now point to `secure.{hostname}.cdn.vtex.com`, where `{hostname}` is the **complete** address of your store. Before, the `secure` subdomain was being pointed to `{account}.vtexcommercestable.com.br`.

## What needs to be done?

If you come across the **"This connection is not private"** error in your store website, repeat the [Hosting a FastStore + VTEX website](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website) guide, making sure that the `secure` subdomain is pointing to `secure.{hostname}.cdn.vtex.com`.
