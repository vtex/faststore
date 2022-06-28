---
sidebar_label: Troubleshooting
description: Troubleshoot errors that have already tricked other FastStore users while integrating their projects with the VTEX platform
---

# Troubleshooting - VTEX integration

While integrating your FastStore project with the VTEX platform, you may come across common errors that have already tricked other FastStore users. This article is intended to help you troubleshoot some of these issues.

## Error - “Your connection is not private”

You may find the following error after trying to complete a purchase in your store:

![](https://vtexhelp.vtexassets.com/assets/docs/src/not-secure___d8621c4ec4766fde0206c32055a2975d.jpeg)

**Cause:** This error occurs when your browser is unable to verify whether a website is safe to visit. This usually happens when the browser notices a problem while creating an SSL connection or can’t verify the certificate.

**Solution:** Follow the [**Configuring external DNS for a custom domain**](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website#step-2---setting-up-your-vtex-account) guide. If the issue persists, check if the `secure` subdomain of your website is pointing to `secure.{hostname}.cdn.vtex.com`, where `hostname` is the complete address of your store.
