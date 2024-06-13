<p align="center">
  <a href="https://github.com/vtex/faststore">
    <img alt="Store Framework" src="https://emoji.slack-edge.com/T02BCPD0X/store-framework/7547b127e929c376.png" width="75" />
  </a>
</p>
<h1 align="center">
  A starter powered by FastStore and NextJS.
</h1>

Kick off your store with this boilerplate.
This starter ships the main FastStore configuration files to get your store up and running blazing-fast. This source code is the base for FastStore projects starter.

## 🚀 Quick start

1. **Install dependencies**

   Install dependencies with yarn

   ```shell
   yarn
   ```

2. **Start developing**

   Navigate into your new site’s directory and start it up.

   ```shell
   yarn dev
   ```

3. **Open the source code and start editing!**

   Your site is now running at `http://localhost:3000`!

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a this NextJS project.

    ./
    ├── node_modules
    ├── @generated
    ├── cms
    ├── public
    ├── src
    ├── test
    ├── .babelrc.js
    ├── .editorconfig
    ├── .prettierignore
    ├── .prettierrrc
    ├── .stylelintignore
    ├── .gitignore
    ├── .eslintignore
    ├── CHANGELOG.md
    ├── codegen.ts
    ├── cypress
    ├── cypress.config.ts
    ├── faststore.config.default.js
    ├── faststore.config.js
    ├── index.ts
    ├── jest.config.js
    ├── LICENSE
    ├── lighthouserc.js
    ├── next-env.d.ts
    ├── next.config.ts
    ├── package.json
    ├── tsconfig.json
    ├── postcss.config.js
    ├── postinstall.js
    ├── pull_request_template.md
    ├── README.md
    ├── stylelint.config.js
    ├── tsconfig.json
    ├── vtex.env

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`LICENSE`**: NextJS is licensed under the MIT license.

6.  **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

7.  **`tsconfig.json`**: The configuration file for the typescript compiler. This will statically analyze your code for errors and bugs before releasing them into production

8.  **`faststore.config.default.js`**: Configure your e-commerce platform, default sales channel etc.

9.  **`@generated`**: Where TypeScript typings are generated for your GraphQL queries. You can use these files for strongly typing your App

10. **`cypress`**: End to End(e2e) tests using Cypress. Most of the scenarios are covered here. Add your custom flows to avoid regressions

11. **`cypress.config.ts`**: [Cypress configuration file](https://docs.cypress.io/guides/references/configuration)

12. **`lighthouserc.js`**: Configures [Google Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci). This is where you can turn on/off lighthouse assertions to be used by Lighthouse CI Bot/hook

13. **`pull_request_template.md`**: Template used when creating your Pull Requests

14. **`.prettierignore`**: Ignore listed files when applying prettier rules

15. **`.eslintignore`**: Ignore listed files when applying eslint rules

## 💻 Code Structure

All code is inside the `src` folder. The code is split into folders that implement an MVC-like architecture.

The `controller` is inside the `src/sdk` folder. This is where you will find most logic for the application. This folder contains hooks for adding items to cart, making graphql queries, resizing images, etc. If you need to write a custom business logic this is probably the place to put this logic.

The `views` are written in the `src/components` folder and are subdivided into domain-specific components. Cart related items are inside the `src/components/cart` folder. Search and Product related components like facets, product summary, and search results are in their respective folders. Basic building blocks components used in the sections are inside the UI folder.
Section components are those components that occupy a whole slice on the webpage and are desirable to be changed by a CMS. Section components are Product Gallery, Product Shelf and Hero and BannerText.

The `model`, in a website, is where the data fetching occurs. Since this project uses Jamstack, a crucial design decision was made to explicitly split where Static and Dynamic data are fetched. The files inside the `src/pages` folder use [NextJS's File System Route API](https://nextjs.org/docs/routing/introduction) to declare routes and fetch static data.

To summarize:

1. `src/pages`: Routes are declared and static data is fetched.
2. `src/views`: Receives static data from `src/pages`, enriches this data with dynamic attributes, and render section components along with SEO tags.
3. `src/components/sections`: Receives necessary data and use domain-specific components (cart/product/search/ui) for rendering a slice on the web page.

### Managing SVG Icons

Icons help build web pages by illustrating concepts and improving website navigation. However, using icons can decrease the page's performance. One option to avoid the decrease of the page's performance is to use SVGs from a single SVG file, located in `/static/icons.svg`, and load them with the `ui/Icon` component.

In the following steps, learn how to add and use a new SVG icon and avoid decreasing page performance while using an icon.

#### Adding an SVG icon

1. In the SVG file, change the `svg` tag to `symbol`.
2. Add an `id` to the symbol. Remember to use an unique `id` and do not replicate it.
3. Remove unnecessary HTML/SVG properties to allow you to style and decrease the final file size, such as `fill`, `stroke-width`, `width`, `height`, and `color`.

An example adding Bell icon:

```svg
<svg style="display:none">
<symbol id="Bell" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><path d="M56.2,104a71.9,71.9,0,0,1,72.3-72c39.6.3,71.3,33.2,71.3,72.9V112c0,35.8,7.5,56.6,14.1,68a8,8,0,0,1-6.9,12H49a8,8,0,0,1-6.9-12c6.6-11.4,14.1-32.2,14.1-68Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M96,192v8a32,32,0,0,0,64,0v-8" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path></symbol>
</svg>
```

#### Using an SVG icon

1. Get the icon's `id` that you created in the SVG icon file.
2. Add the `id` in the React component that you desire to use the SVG icon. For example

```tsx
// src/components/ui/MyIconButton/MyIconButton.tsx
import Icon from '@faststore/ui'

function ButtonIcon() {
  return (
    <button>
      <Icon name="<<symbol_id>>" weight="thin" />
    </button>
  )
}

export default ButtonIcon
```

This project uses SVGs from [Phosphor icons](https://phosphoricons.com/).
More details, please refer to this [doc](https://www.faststore.dev/docs/icons).

## 🖊️ Styling Components

Our customized themes are based on [Design Tokens](https://css-tricks.com/what-are-design-tokens/) using [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) or a CSS class for each token. We utilize the styles from the `@faststore/ui` package, which are imported into the `src/styles` directory. Additionally, each component's styles are imported directly into the section where they are being used. Refer to [Theming overview](https://www.faststore.dev/docs/theming-overview) for more details.

## 🍒 Adding queries

We use [graphql-codegen](https://www.graphql-code-generator.com/) to pre-process GraphQL queries. This compilation generates TypeScript typings and configurations for our graphql server under the folder `@generated/graphql`.
This means we can statically analyze your code in search of bugs and secure your graphql server before each deploy. If, however you need to change any GraphQL Fragment, Query or Mutation, you will need to regenerate the whole thing. To do this, open your terminal and type

```sh
$ yarn dev
```

Now, after the nextjs development server is up and running, open another terminal and run

```sh
$ yarn generate
```

That's it! you have just regenerated all graphql queries/fragments for your application and the new data you requested should be available to your component.

> Pro tip: Pass `-w` to the `yarn generate` command so it watches for changes and you don't need to run this command multiple times.

## CMS Integration

This store is integrated with [VTEX headless CMS](https://v1.faststore.dev/tutorials/cms/0).

The page rendered with CMS is the index page: `pages/index.tsx`
The `cms/faststore` contains the `content-types.json` and `sections.json` files.

### CMS configs

It's possible to change the CMS tenant and workspace at `faststore.config.default.js`.

## 🎓 Learning the Frameworks

Looking for more guidance? Full documentation for FastStore lives [on this GitHub repository](https://github.com/vtex/faststore). Also, for learning NextJS, take a look at the [NextJS Website](https://nextjs.org/docs/getting-started), they have plenty of tutorials and examples in there.

## ⚡ Performance & QA

This project has strict performance budgets. Right out of the box, this project performs around 95 on Google's Page Speed Insights website, which usually is way more strict than your laptop's chrome lighthouse. Every time you commit to the repository, our QA bots will run and evaluate your code quality. We recommend you NEVER put in production a code that breaks any of the bots. If a bot breaks and still you need to put the code into production, change the bot config (`lighthouserc.js`, `cypress.config.ts`) to make it pass and merge. This way you ensure your website will keep performing well during the years to come.

## Adding third party scripts

Adding third-party scripts to a webpage usually makes it slow. To maintain great performance while third-party scripts are added, this project uses [Partytown](https://github.com/BuilderIO/partytown/), a lazy-load library that helps relocate intensive scripts into a web worker and off of the main thread.

To add scripts using Partytown, add the `type="text/partytown"` to the script tag and make sure to add it before the Partytown script or component.
Some third-party scripts execute expensive computations that may require some time to run, making pages few slow. If that's the case, wrap those in a function and reference it on the Partytown `forward` prop. By doing this, Partytown will run this function on a web worker so it doesn't block the main thread.

```tsx
export const onRenderBody = ({ setHeadComponents }) => {
  // ...
  setHeadComponents([
    <script type="text/partytown">
      window.expensiveFunction = function() {/* expensive computation used by custom-script */}
    </script>
    <script key="custom-script" src="*://domain/path" type="text/partytown" />,
    <Partytown key="partytown" forward={["expensiveFunction"]} />
  ])
  // ...
}
```

For more information about integrating third-party scripts: [Partytown Wiki](https://github.com/BuilderIO/partytown/wiki).
