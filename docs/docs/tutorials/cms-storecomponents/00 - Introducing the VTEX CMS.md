---
id: 0
sidebar_position: 2
sidebar_label: "0. Introducing the VTEX Headless CMS"
toc_max_heading_level: 4
pagination_next: tutorials/cms-storecomponents/1
---

# Part 0: Introducing the VTEX Headless CMS

In this tutorial you'll learn how to integrate your storefront project with **VTEX Headless CMS**, our preferred solution for content management.

A Content Management System (CMS) allows others to edit the frontend content of your store without having to touch your code at all. VTEX Headless CMS is a VTEX App and a no-code management system for storefront content. 

Once you finish this tutorial, editors will have the autonomy to create, edit, and publish web content via the VTEX Admin with the VTEX Headless CMS app.

---

## Before you start

This tutorial covers how to integrate your **Gatsby + FastStore** project with the [**VTEX Headless CMS**](https://help.vtex.com/). VTEX Headless CMS is available at the Admin of your VTEX account and is our preferred solution for content management.

:::caution
This tutorial is intended for those who started their FastStore project with the Store Components starter. If you started your project with the Base Store starter, please refer to [this](/tutorials/cms-overview) tutorial.
:::

Also, before starting this tutorial, make sure you have:

- [A Gatsby + FastStore project set up.](/tutorials/gatsby-overview)
- Access to a VTEX account.
- [The VTEX IO CLI installed in your machine.](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference)

---

## VTEX Headless CMS

VTEX Headless CMS is a **Headless CMS**. That means we store our content in a data layer decoupled from the frontend and use VTEX Headless CMS to deliver this content as structured data to our FastStore project via an API.

As with any other VTEX Admin app, you can install the VTEX Headless CMS in your VTEX account and access it via the Admin. Once installed in your account, you can access the VTEX Headless CMS at **Store Setup > CMS (alpha) > Pages (alpha)**. 

You'll then see a list of all web pages created with the VTEX Headless CMS. Notice that this list will be empty at first, but once editors start creating new pages, your interface should look similar to the following:

![CMS Interface](/img/tutorials/cms-storecomponents/cms.png)

### Content Types

Each page created with the VTEX Headless CMS is related to a specific URL and is distinguished by the following properties:

- **Name:**  identifies a given page. This name is not available elsewhere and is used only internally in the VTEX Headless CMS for identification purposes.
- **Type:** determines the nature of a page. For example, the **Type** can be a Landing Page, a Product Listing Page (PLP), a Product Detail Page (PDP), etc. You, as a developer, are the one who will define which content types will be available for the editors of your store.
- **Last modified:** indicates the last time a given page was edited.
- **Version:** identifies the state of a page, if it's *Draft*, *Publishing*, or *Published*. Notice that editors can have more than one version of the same page with distinct settings and content. 

![CMS Settings](/img/tutorials/cms-storecomponents/cms-content-types.png)

### Sections 

Once you start creating or editing a page, you'll see that these are composed of a series of **Sections**. 

![CMS Section](/img/tutorials/cms-storecomponents/cms-section.png)

A Section represents the structure of a React component that you, as a developer, chose to be available at the CMS. Check the following example of the Carousel Section being used:

![Carousel Section](/img/tutorials/cms-storecomponents/cms-carousel.png)

A Section can be reused in different pages of an ecommerce.
