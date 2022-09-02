---
description: Reducing the JavaScript bundle size downloaded during page load is essential to ensure a performant website.
tags: 
    - performance
---

# Analyzing a project's bundle size

Rendering a page and executing JavaScript files take up a significant portion of the frontend loading time. However, another crucial factor in delivering pages with speed is the amount of the JavaScript bundle downloaded over the network. **The smaller the JavaScript bundle size, the faster the web page will be available to users.**

This guide will explain the importance of bundle size to performance and present tools to monitor, visualize, and shrink your Javascript bundles.

## Performance impact

Because large Javascript bundles take longer to download, they usually affect the page loading time negatively. They also affect most performance metrics, such as the **Largest Contentful Paint (LCL)**, **Cumulative Layout Shifts (CLS)**, **First Input Delay (FID)**, **Total Blocking Time (TBT)**, and **Time To Interactive (TTI)**. Also, because large Javascript bundles take longer to be parsed and compiled into machine code, they usually delay Javascript initialization. 

This way, if a customer happens to be on a sluggish network or using a device with a low CPU, these big bundle sizes may end up delaying loading time, rendering, user interaction, and even page scrolling.

## Detecting large bundle sizes

Now that we know how the webpack bundle affects performance, we must detect which are the largest bundles in our project so we can then take targeted actions to reduce our project's bundle size. 

### Measuring and visualizing your webpack bundle

You can use several tools available on the market to measure and visualize packages that are larger than expected, such as:

- [`next-plugin-bundle-stats`](https://github.com/relative-ci/bundle-stats/tree/master/packages/next-plugin) | [`gatsby-plugin-bundle-stats`](https://www.gatsbyjs.com/plugins/gatsby-plugin-bundle-stats/?=bundle) - analyzes webpack stats (bundle size, assets, modules, packages) and compares the results between different builds. After configuring it in your project, you can visualize your bundle stats at `https://{accountName}.vtex.app/bundle-stats.html`.
  ![bundle-stats](https://vtexhelp.vtexassets.com/assets/docs/src/bundlestats___e6addee53a5a8168ac761af20cf2da0c.png)
- [`next-bundle-analyzer`](https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer) | [`gatsby-plugin-webpack-bundle-analyser-v2`](https://www.gatsbyjs.com/plugins/gatsby-plugin-webpack-bundle-analyser-v2/) - generates interactive bundle treemaps, where larger blocks correlate to larger file sizes. After configuring it in your project, you can visualize your bundle treemap at `https://{accountName}.vtex.app/bundle-analyser.html`.
  ![bundle-analizer](https://vtexhelp.vtexassets.com/assets/docs/src/bundleanalyser___24b663f19095000bb67292cf3597b082.png)

:::tip
If you are using the [Base Store - Gatsby](https://github.com/vtex-sites/gatsby.store) starter, the `gatsby-plugin-bundle-stats` and `gatsby-plugin-webpack-bundle-analyser-v2` plugins are already set up.
:::

### Checking a package's size

To check the size of the imported packages in your project while coding, we suggest using the [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost) plugin. This plugin displays the size of each package inline in your code editor. You can also set custom thresholds for what you consider a small or medium package. Please refer to [this](https://citw.dev/posts/import-cost) page for more information.

![Import Cost plugin](https://vtexhelp.vtexassets.com/assets/docs/src/importCost___470b878023d5ae278d60e99cb29b0bd6.png)

## Dealing with large bundle sizes

After identifying the largest packages in your store, you can take some actions to reduce your project's bundle size. You can try code splitting, fetching packages asynchronously, or replacing the package with a lighter and more specialized solution. We'll go into these approaches in the following sections.

### Replacing large packages

If you detect an undesired large package in your project, you can look for some lightweight alternative. For that, you can use [BundlePhobia.com](https://bundlephobia.com/) to check how the package compares to others. 

BundlePhobia provides direct suggestions on similar packages. Test some of them and check if they satisfy your needs. Remember to ensure that they support the most widely used browsers as well.

![BundlePhobia](https://vtexhelp.vtexassets.com/assets/docs/src/bundlephobia___f0a53074bbc903ecf86116ee5103abb8.png)

You can also use BundlePhobia to check for tree-shakable libraries, i.e., when bundler tools, such as webpack, can detect which exports are unused in a project and perform dead code elimination.

### Code splitting

Code splitting is the process of splitting up a piece of code into various bundles or components that can be loaded simultaneously or on demand. You can use code-splitting to lazy load just what is, in fact, needed by the user in order to reduce the initial script loaded on a page. This can significantly improve your website's performance, resulting in smaller bundle sizes and faster initial load experiences. You can also use code splitting to request smaller packages in parallel and cache code that isn't changed regularly. Make sure to check [React](https://reactjs.org/docs/code-splitting.html#reactlazy), [Next.js](https://nextjs.org/docs/advanced-features/dynamic-import), and [Gatsby](https://www.gatsbyjs.com/docs/how-code-splitting-works/) capabilities for implementing lazy loading.