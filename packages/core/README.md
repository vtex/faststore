<p align="center">
  <a href="https://github.com/vtex/faststore">
    <img alt="Store Framework" src="https://emoji.slack-edge.com/T02BCPD0X/store-framework/7547b127e929c376.png" width="75" />
  </a>
</p>
<h1 align="center">
  A starter powered by FastStore and NextJS
</h1>

Kickoff your store with this boilerplate. This starter ships with the main FastStore configuration files you might need to get up and running blazing fast with the blazing-fast store for React.

## ⚠️ Before you start

As of Dec, 22, 2021, this starter is still far from covering most basic cases found on VTEX. To summarize what we still do not support that is considered basic on the VTEX commerce platform, we prepared the list below. If the feature you want is listed, you can either wait for us to add support to the feature, or fork the repo and implement on your own. Note that, by forking the repo, you will miss new features and improvements we do in this repo and you will need a developer to backport the feature to your store. Finally, this list is a work in progress, so some features may be missing from both base.store starter and this list.

1. Multiple CMS Previews. Only one user is allowed to preview content from the CMS at a time. If two users preview any content from any page at the CMS, the previews are not consistent and one user may see data from the other.
2. Price Table
3. Regionalization
4. Internationalization
5. Shared Cart (Carrinho compartilhado)
6. Clear products that are our of stock from cart
7. GDPR (LGDP)
8. Shipping simulation
9. Sitemap
10. Sku selector on PDP
11. Promotions via utm
12. Product specifications

## 🚀 Quick start

0. **Clone this repo**

   Get up and running by cloning this repo.

   ```shell
   # Clone this repo into your machine
   npx degit vtex-sites/nextjs.store awesome.store
   ```

1. **Install dependencies**

   Install dependencies with yarn

   ```shell
   cd awesome.store/
   yarn
   ```

2. **Setup store.config.js**

   Choose the ecommerce platform provider of your choice in the `store.config` file and set the corresponding options. For instance, to connect to the VTEX platform on the store `fashioneurope`:

   ```js
   module.exports = {
     platform: 'vtex',

     api: {
       storeId: 'fashioneurope'
       environment: 'vtexcommercestable'
     }
   }
   ```

3. **Start developing**

   Navigate into your new site’s directory and start it up.

   ```shell
   yarn develop
   ```

4. **Open the source code and start editing!**

   Your site is now running at `http://localhost:3000`!

    Open the `awesome.store` directory in your code editor of choice and edit `src/pages/index.tsx`. Save your changes and the browser will update in real-time!

## :technologist: Contributing

1. **Keep the CHANGELOG updated**
   We use a CHANGELOG to keep the history of all notable changes made to this repository.
   Each PR must have at least one entry on the `[UNRELEASED]` section of the `CHANGELOG.md` file.

## 🧐 What's inside?

A quick look at the top-level files and directories you'll see in a NextJS project.

    ./
    ├── node_modules
    ├── src
    ├── .gitignore
    ├── .eslintignore
    ├── .prettierignore
    ├── .prettierrrc
    ├── .eslintrc
    ├── LICENSE
    └── yarn.lock
    ├── package.json
    ├── tsconfig.json
    ├── store.config.js
    ├── README.md
    ├── CHANGELOG.md
    ├── __generated__
    ├── babel.config.js
    ├── cypress
    ├── cypress.json
    ├── lighthouserc.js
    ├── public
    ├── pull_request_template.md
    ├── renovate.json

1.  **`/node_modules`**: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

2.  **`/src`**: This directory will contain all of the code related to what you will see on the front-end of your site (what you see in the browser) such as your site header or a page template. `src` is a convention for “source code”.

3.  **`.gitignore`**: This file tells git which files it should not track / not maintain a version history for.

4.  **`.prettierrc`**: This is a configuration file for [Prettier](https://prettier.io/). Prettier is a tool to help keep the formatting of your code consistent.

5.  **`.eslintrc.js`**: This is a configuration file for [ESLint](https://eslint.org/). ESlint is a tool to find and fix problems in your JavaScript code.

6.  **`LICENSE`**: NextJS is licensed under the MIT license.

7.  **`yarn.lock`** (See `package.json` below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. **(You won’t change this file directly).**

8. **`package.json`**: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

9. **`tsconfig.json`**: The configuration file for the typescript compiler. This will statically analyze your code for errors and bugs before releasing them into production

10. **`store.config.js`**: Configure your e-commerce platform, default sales channel etc.

11. **`README.md`**: A text file containing useful reference information about your project.

12. **`CHANGELOG.md`**: A text file containing all notable changes to the project.

13. **`__generated__`**: Where TypeScript typings are generated for your GraphQL queries. You can use these files for strongly typing your App

14. **`babel.config.js`**: [Babel configurations](https://babeljs.io/docs/en/configuration#babelrcjson) for you app. This is where you can change the targeted browsers.

15. **`cypress`**: End to End(e2e) tests using Cypress. Most of the scenarios are covered here. Add your custom flows to avoid regressions

16. **`cypress.json`**: [Cypress configuration file](https://docs.cypress.io/guides/references/configuration)

17. **`lighthouserc.js`**: Configures [Google Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci). This is where you can turn on/off lighthouse assertions to be used by Lighthouse CI Bot/hook

18. **`pull_request_template.md`**: Template used when creating your Pull Requests

19. **`renovate.json`**: Renovate configuration file to keep your store always fresh with FastStore's latest versions

20. **`.prettierignore`**: Ignore listed files when applying prettier rules

21. **`.eslintignore`**: Ignore listed files when applying eslint rules

## 💻 Code Structure

All code is inside the `src` folder. The code is split into folders that implement an MVC-like architecture.

The `controller` is inside the `src/sdk` folder. This is where you will find most logic for the application. This folder contains hooks for adding items to cart, making graphql queries, resizing images, etc. If you need to write a custom business logic this is probably the place to put this logic.

The `views` are written in the `src/components` folder and are subdivided into domain-specific components. Cart related items are inside the `src/components/cart` folder. Search and Product related components like facets, product summary, and search results are in their respective folders. Basic building blocks components are inside the UI folder. Components like button, checkbox, and modal are good candidates for the UI folder.
Section components are those components that occupy a whole slice on the webpage and are desirable to be changed by a CMS. Section components are Product Gallery, Carousel, Shelf and Product description.

The `model`, in a website, is where the data fetching occurs. Since this project uses Jamstack, a crucial design decision was made to explicitly split where Static and Dynamic data are fetched. The files inside the `src/pages` folder use [NextJS's File System Route API](https://nextjs.org/docs/routing/introduction) to declare routes and fetch static data.

To summarize:

1. `src/pages`: Routes are declared and static data is fetched.
2. `src/views`: Receives static data from `src/pages`, enriches this data with dynamic attributes, and render section components along with SEO tags.
3. `src/components/sections`: Receives necessary data and use domain-specific components (cart/product/search/ui) for rendering a slice on the web page.

## ✏️ Adding Components

What better than an example for learning the best practices while adding components? In this example, we will add a button component.
Components live on the `src/components` folder. Each component may have, at most, 3 files: a component file, an export file, and a styling file.
First, let's create a folder and the files.

```sh
mkdir src/components/ui/Button
touch src/components/ui/Button/Button.tsx
touch src/components/ui/Button/index.tsx
```

The `index.tsx` is just an export file, so its content is simple:

```tsx
export { default } from './Button'
```

The real thing happens on `Button.tsx`. On this file let's define the component like:

```tsx
interface Props {}

function Button(props: Props) {
  return <button {...props} />
}

export default Button
```

And, that's it! Now you have a working button that you can use anywhere on your project. FastStore, however, brings a handy library called `@faststore/ui` with built-in components to help you speed up your development. To use it, just change `Button.tsx` to:

```tsx
import { Button as UIButton } from '@faststore/ui'
import type { ButtonProps } from '@faststore/ui'

interface Props extends ButtonProps {}

function Button(props: Props) {
  return <UIButton {...props} />
}

export default Button
```

Now, your Button component is powered by Store UI. However, if you try to use this on your app you will see that the button is lacking styles. To add styles, we will use CSS modules because they allow us to target data attributes. On your terminal, type:

```sh
touch src/components/ui/Button/button.scss
```

Now, on `button.scss`:

```css
[data-store-button] {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
```

This `data-store-button` is a CSS data attribute selector. To know which selectors are available, check [FastStore UI docs](https://faststoreui.netlify.app/).

Now, include the component's CSS into the Store's CSS. Open `src/styles/global/components.scss` and import this CSS with:

```scss
// ...
@import "src/components/ui/Button/button.scss";
// ...
```

For most components, you would stop here. However, buttons can have different variants. For instance, suppose you want to have a button component with primary and secondary variants. To add variants to the component, update `Button.tsx`:

```tsx
import { Button as UIButton } from '@faststore/ui'
import type { ButtonProps } from '@faststore/ui'

interface Props extends ButtonProps {
  variant: 'secondary' | 'primary'
}

function Button({ variant, ...props }: Props) {
  return <UIButton data-button-variant={variant} {...props} />
}

export default Button
```

and then, on `button.scss`:

```css
[data-store-button][data-button-variant='primary'] {
  background: blue;
}

[data-store-button][data-button-variant='secondary'] {
  background: pink;
}
```

You can also use classes, if you wanted to:

```tsx
function Button({ variant, ...props }: Props) {
  return <UIButton className={variant} {...props} />
}
```

```css
.primary[data-store-button] {
  background: blue;
}

.secondary[data-store-button] {
  background: pink;
}
```

Now we have a styled Button component that accepts different variants!! 🎉

### Managing SVG Icons
Icons help build web pages by illustrating concepts and improving website navigation. However, using icons can decrease the page's performance. One option to avoid the decrease of the page's performance is to use SVGs from a single SVG file, located in `/static/icons.svg`, and load them with the `ui/Icon` component.

In the following steps, learn how to add and use a new SVG icon and avoid decreasing page performance while using an icon.

> ⚠️ Warning
>
> This is a recommendation while using icons on a web page. Evaluate if this fits in your project.

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
import Icon from 'src/components/ui/Icon' // this path can be outdated.

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

## 🖊️ Styling Components

Our customized themes are based on [Design Tokens](https://css-tricks.com/what-are-design-tokens/) using [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/--*) or a CSS class for each token. Today, we have the following files in the `src/styles` folder:

### `tokens.scss`

Here you'll find the basic structure to build your theme (font base, color palette, spacing, color-text, body background color...), feel free to update it with your brand guidelines.

#### <b>Colors</b>

We suggest using a color palette of 3 colors and its gradation: `primary`, `secondary` and `neutral`.

We also listed a couple of customizable tokens so you can easily change your body background, for example.

If you feel the need to edit some of the color decisions, you can enter `tokens.scss` and update the semantical tokens. E.g.:

```scss
--fs-border-color: var(--fs-color-neutral-4); // Current
--fs-border-color: var(--fs-color-neutral-5); // Updated
```

#### <b>Typography</b>

We use the [Modular Scale](https://www.modularscale.com/) setting to create our text-sizes. If you want to change it, just set the `--fs-text-size-base` and the `scale` ratio.

#### <b>Spacing</b>

The spacing scale is based on `rem` sizes, so it will remain consistent if you change the `--fs-text-size-base`.

### `layout.scss`

List of classes used to create default page grid.

```scss
.layout__content-full // Should be used for sections that are side to side, generally with a colored background.
.layout__content // Should be used for sections that fit centered on the grid.
.layout__section // This class only adds default vertical margins for page sections.
```

![grid-example-image](https://user-images.githubusercontent.com/3356699/150801221-4027dc6a-1cc4-40a7-a323-8be7a148458d.png)

### `typography.scss`

For the typography-related styles, we decided to use classes to add extra stylings like `font-weight` and `line-height`. In this file, you'll see all the classes for titles, paragraphs, and default settings on the body. You can create new ones here if needed.

## 🍒 Adding queries

We use [graphql-codegen](https://www.graphql-code-generator.com/) to pre-process GraphQL queries. This compilation generates TypeScript typings and configurations for our graphql server under the folder `@generated/graphql`.
This means we can statically analyse your code in search of bugs and secure your graphql server before each deploy. If, however you need to change any GraphQL Fragment, Query or Mutation, you will need to regenerate the whole thing. To do this, open your terminal and type

```sh
$ yarn develop
```

Now, after the nextjs development server is up and running, open another terminal and run

```sh
$ yarn generate
```

That's it! you have just regenerated all graphql queries/fragments for your application and the new data you requested should be available to your component.

> Pro tip: Pass `-w` to the `yarn generate` command so it watches for changes and you don't need to run this command multiple times

## CMS Integration

This store is integrated with [VTEX headless CMS](https://www.faststore.dev/tutorials/cms/0). 

The page rendered with CMS is:

- index page: `pages/index.tsx`

### CMS configs

It's possible to change the CMS tenant and workspace at `store.config.js`.

## 🎓 Learning the Frameworks

Looking for more guidance? Full documentation for FastStore lives [on this GitHub repository](https://github.com/vtex/faststore). Also, for learning NextJS, take a look at the [NextJS Website](https://nextjs.org/docs/getting-started), they have plenty of tutorials and examples in there.

## ⚡ Performance & QA

This project has strict performance budgets. Right out of the box, this project performs around 95 on Google's Page Speed Insights website, which usually is way more strict than your laptop's chrome lighthouse. Every time you commit to the repository, our QA bots will run and evaluate your code quality. We recommend you NEVER put in production a code that breaks any of the bots. If a bot breaks and still you need to put the code into production, change the bot config (`lighthouserc.js`, `cypress.json`) to make it pass and merge. This way you ensure your website will keep performing well during the years to come.

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

For more information about integrating third-party scripts: [Partytown Wiki](https://github.com/BuilderIO/partytown/wiki)
