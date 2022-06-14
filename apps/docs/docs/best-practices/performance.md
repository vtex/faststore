---
description: Guidelines on how to maintain your store's performance.
keywords:
  - Performance
  - Best practices
  - ecommerce
  - react
---

# Performance best practices
Working with [FastStore](https://faststore.dev/tutorials/fundamentals/1) is one step toward high-performance stores. However, you must include performance best practices in your development process to keep your store's performance and stability.

Refer to the following best practices to guarantee the quality and usability of your store while working with FastStore.

## Before you start
This article's guidelines are based on [Google Web Vitals](https://web.dev/i18n/en/vitals/). Web Vitals is a Google initiative that aims to provide unified guidance for delivering a great user experience on the web.

Google refers to Core Web Vitals as a subset of the three most important metrics used to measure a page's health. They are:

- Largest Contentful Paint (LCP): Focuses on the loading speed. It measures the time it takes to render the largest visible element of the page within the viewport.

- First Input Delay (FID): Focuses on the page's interactivity. It measures the speed of response to the user's first interaction with the page.

- Cumulative Layout Shift (CLS): Focuses on the page's stability. It measures the impact of undesired content shifts that occur during the entire lifespan of a page. Layout shifts happen when an element on the page changes places with another while the user is interacting with it. 

For more details on each of these metrics, visit [Google's Web Vitals](https://web.dev/i18n/en/vitals/) reference guide.


## Testing each deploy with integration tests

:::caution The [VTEX IO WebOps](https://www.faststore.dev/how-to-guides/webops) platform automatically runs integration tests and Lighthouse audits for each PR on your FastStore project.:::

Each deployment to your code can impact the store's performance. Ensure to run integration tests into your FastStore project, to identify code smells, analyze performance and avoid regressions.

### Running integration test
An integration test takes a small group of units of your project and tests their behavior as a whole, verifying if they coherently work together or detect any bug.

For example, an `add to cart` button and a `cart` item are two different elements on a store website. However, when a user clicks the button to add a product to the cart, you must verify that these functionalities are integrated and work properly for the end-user.

To run integration tests, you should combine a stack of technologies of an Integration testing tool/suite, such as [Cypress](https://www.cypress.io/) and a CI environment to run integration tests, such as [VTEX IO WebOps](https://www.faststore.dev/how-to-guides/webops).

::: caution the [gastby.store](https://github.com/vtex-sites/gatsby.store) and [nextjs.store](https://github.com/vtex-sites/nextjs.store) starters already runs integration tests and use the WebOps as a CI environment. :::


#### Integration testing tool
An integration testing tool helps you detect bugs early in development and avoid future mistakes. Use the tool to:

- Create tests scenarios that can be reused.

- Determine which units should be prioritized during testing.

- Create test cases that cover all aspects of the UI to get insights on how you can improve the user experience.

- Run tests while developing and get instant feedback. 

- Run tests automatically to each pull request.

- Block merging of a pull request if tests fail.

- Run tests automatically before deploying to production.


## Checking your store bundle size
Bundle size is the amount of JavaScript files a user will have to download to load your store on the browser.

Analyzing the store bundle size is important to:
- Find out what packages contribute the most code.
- Improve the store load time by checking opportunities to decrease the bundle size.

> ⚠️
>  
> If you are using the [Base Store - Gatsby](https://github.com/vtex-sites/gatsby.store) starter, the `gatsby-plugin-bundle-stats` and `gatsby-plugin-webpack-bundle-analyser-v2` plugins are already set up. Otherwise, refer to the [Adding `gatsby-plugin-bundle-stats` and `Bundle Analyser`]() guide.

### `gatsby-plugin-bundle-stats`
[`gatsby-plugin-bundle-stats`](https://www.npmjs.com/package/gatsby-plugin-bundle-stats) is a plugin to analyze webpack stats (bundle size, assets, modules, packages) and compare the results between different builds.

To see the bundle stats, you can access the following path:

- `https://{accountName}.vtex.app/bundle-stats.html#/`

️
> ⚠️
> 
> Remember to replace the values between the curly brackets according to your scenario.

You will see a similar page as below:

![bundle-stats](https://user-images.githubusercontent.com/67270558/161589986-b6b88af5-442c-49aa-a674-cd18a001e3a5.png)

With the details displayed for Assets, Modules, Packages you can have insights, for example, on how to decrease the amount of initial JavaScript size or which package has a larger size.

### `gatsby-plugin-webpack-bundle-analyser-v2`

The `gatsby-plugin-webpack-bundle-analyser-v2` launches a server that hosts an interactive treemap of your bundle to be analyzed.

For analyzing you app's bundle, you can access the following:

- `https://{accountName}.vtex.app/bundle-analyser.html`

️
> ⚠️
> 
> Remember to replace the values between the curly brackets according to your scenario.

You will see a similar page as below:

![bundle-analizer](https://user-images.githubusercontent.com/67270558/161594677-0502cfaf-4419-449d-8fc4-0da9a29cb38f.png)

From the given example, we have the name of the bundle ({name}.js) followed by the node modules folder, in which it's noticeable that the `react-dom` takes up the majority of the bundle size.

Knowing this allows you to take actions to lower the size of your project's bundle, for example:
- Code splitting.
- Fetching bundles asynchronously.
- Replacing a huge dependence with a more basic and specialized solution.


## Using Web fonts
Web fonts files can impact page performance by [causing layout shifts](https://web.dev/debug-layout-shifts/#identifying-the-cause-of-a-layout-shift). The issue happens when the web font replaces a fallback font, and the font takes up, for example, different letter spacing or character height on the page.

Also, if the font downloads slowly on the website, text rendering may be delayed and affect the [FCP](https://web.dev/fcp) and [LCP](https://web.dev/lcp/) metrics.


### Do's 

- **Use the `@font-face` CSS rule**. The `@font-face` allows you to split the font family into a collection of resources, such as, unicode subsets, and distinct style variants.

```
@font-face {
  font-family: 'MyWebFont'; /* Define the custom font name */
  src:  url('myfont.woff2') format('woff2'),
        url('myfont.woff') format('woff'); /* Define where the font can be downloaded */
  font-display: fallback; /* Define how the browser behaves during download */
}
```

- **Use `font-display: fallback`** as a property of `@font-face`, such as Unicode subsets and distinct style variants. The fallback option avoids disturbing the user's reading experience by not shifting text around while the new font loads.

- **Create a subset of font characters.** Font subsetting reduces font filesize by allowing the browser only to download the font's range of characters defined in the `@font-face` attribute.
```
@font-face {
    font-family: "Open Sans";
    src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2");
    unicode-range: U+0025-00FF;
}
```

> ℹ️
> 
> The subsetting process is often used with `unicode-range`, a `@font-face` property that defines which characters are supported by the font face. 


Use the [glyphanger](https://github.com/zachleat/glyphhanger) tool, to generate font subsets for your project.

- **Include a global stylesheet using `gatsby-browser.js`.** Use a global stylesheet to fetch the web font file as soon as the page starts to load.

## Using SVG icons 
Having icons in the JavaScript bundle files can affect the page's performance by increasing the total blocking time (TBT), Time to Interactive (TTI) and the Largest Contentful Paint (LCP) metrics.

### Do
- **Use a single SVG file and load it via the [Icon](https://faststore.dev/reference/ui/atoms/Icon) component.** 
Using SVG icons is a good option to remove unused JavaScript and improve the TBT, LCP, and TTI metrics.

**Before**

![before](https://user-images.githubusercontent.com/15680320/157344845-29749e64-37f7-44e5-aa72-56a125e82a5b.png)

**After**
![before](https://user-images.githubusercontent.com/15680320/157344685-f6f9db10-417a-432f-aec8-ac08810a5e11.png)


## Using responsive images
Responsive images may help reduce page loading time as they adapt to multiple device screen sizes and resolutions. Serving the most performant picture for each user agent can result in significant performance gains, particularly on mobile devices.

### Do's
- Use SVG or Unicode for icons instead of raster images.

- Use relative sizes for images to prevent them from accidentally overflowing the container.

- Consider the performance costs when using image replacement techniques, i.e., replacing a text element with an image.

- Include image optimization and compression tools into your workflow to reduce file sizes.

To optimize image loading performance, we recommend using [Thumbor](http://www.thumbor.org/), an open-source image service that can crop, resize and flip images.


The thumbor has the ability to: 
- Reduce the file size.
- Crop and scale images automatically with smart image recognition.
- Load and save images from anywhere.

## Managing the impact of third-party scripts

Third-party scripts can provide useful solutions for your store website; for example, Google Analytics provides audience data. This data, however, is delivered via scripts, which may slow down page loading and interactivity.

### Do
- Use a web worker to run third-party scripts.

A solution to add third-party scripts to a store page without affecting the performance and usability of the page is using [**Partytown**](https://partytown.builder.io/).

Partytown is a lazy-loaded package that moves third-party scripts into a web worker and speed up web pages by dedicating the main thread to your code.

> ℹ️
>  
> The main thread is where a browser processes user events and paints.

The Partytown has the ability to:

- Move the execution of third-party scripts from the main thread to a web worker, and the script is left running within the web worker.
 
- Block third-party scripts effects on performance, and the system is free to react to user interactions.

- Execute scripts asynchronous.

:::caution The [Base Store](https://www.faststore.dev/starters/base) starters has the support for partytown.:::

## Improving Web Accessibility
[Web Accessibility ](https://www.w3.org/WAI/fundamentals/accessibility-intro/#what) means that websites, tools, and technology are created and developed so that individuals with disabilities or temporarily disabilities can use them. 

When developing for the web, accessibility is critical in ensuring that individuals of all abilities have equal access and opportunities.

Consider the following accessibility best practices while developing your storefront:


- **Use keyboard accessibility**
Users that rely on keyboard interactions (buttons and inputs) or users who use keyboard shortcuts to be more efficient will benefit from a keyboard navigation strategy.

- **Use Lighthouse**
Check out Lighthouse Accessibility audit to find and correct accessibility issues.

- **Run integration tests**
Integration tests can evaluate the web accessibility of your storefront.

- **Use semantic HTML**
Assistive technologies, i.e., screen readers, use semantic HTML, such as `<button>`, `title`, `placeholder`, `<label>`, etc., to provide context about a website to the user.

- **Ensure accessibility of interactive menus, modals, and custom widgets**

## Related articles
- [Web vitals](https://web.dev/vitals/)
- [Best practices for fonts](https://web.dev/font-best-practices/)
- [Partytown](https://partytown.builder.io/)
- [Thumbor](http://www.thumbor.org/)
- [Making the Web Accessible](https://www.w3.org/WAI/)
- [Web.dev accessibility](https://web.dev/accessible/)