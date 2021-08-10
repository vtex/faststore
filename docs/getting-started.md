# Getting started 

At the end of this tutorial, you will have your VTEX store running our [SFJ starter](https://github.com/vtex-sites/storecomponents.store) at `http://{account}.vtex.app`.

## Requirements

Before you start building your very first SFJ store, please make sure:

- You have a GitHub account.
- Your VTEX account is part of the [VTEX Sites](https://github.com/vtex-sites) organization.
- You're comfortable using [Git commands](https://git-scm.com/docs).
- You know what [Jamstack](what-is-jamstack.md) is.
- You're familiar with [Gatsby's](https://www.gatsbyjs.com/) core concepts.
- You know what [GraphQL](https://graphql.org/) is and its basic concepts.
- You know how to develop [React](https://reactjs.org/) components.

## Tools

To build an SFJ store, we'll make use of different technologies and frameworks. Therefore, before proceeding any further, make sure you have the following tools installed in your machine:

- [Node.js](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Yarn](https://yarnpkg.com/), a package manager for your code that allows you to use and share code with other developers from around the world.
- [Gatsby](https://www.gatsbyjs.com/docs/quick-start/), a React-based open-source framework for creating websites and apps. 
- [Toolbelt](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-toolbelt), a command-line interface that provides all the necessary features to start developing apps with VTEX IO. 

## Step by step

### Step 1: Setting up your development environment

1. Open up the terminal and log in to your VTEX account.

```shell
vtex login {account}
```

2. Run the following command to setup the environment and install all the necessary apps to start developing with the SFJ.

```shell
vtex install vtex.admin-search@1.x vtex.admin-cms@0.x vtex.graphql-gateway@0.x vtex.store-sitemap@2.x vtex.store@2.x vtex.messages@1.x vtex.cms-builder-sf-jamstack@0.x && vtex settings set vtex.store enableOrderFormOptimization true && vtex settings set vtex.messages automaticTranslation false && vtex settings set vtex.search-resolver slugifyLinks true
```

>ℹ️ *Before proceeding, make sure that the [VTEX Intelligent Search](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/3qgT47zY08biLP3d5os3DG) app (`vtex.search-resolver@1.x`) is installed in your VTEX account and that [indexing](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/6wKQgKmu2FT6084BJT7z5V) has started. Check [our docs](https://help.vtex.com/tracks/vtex-intelligent-search--19wrbB7nEQcmwzDPl1l4Cb/3qgT47zY08biLP3d5os3DG) for more info.*

3. [Create a new repository from this template](https://github.com/vtex-sites/storecomponents.store) inside the [`vtex-sites` organization.](https://github.com/vtex-sites) with the name `{account}.store`.

### Step 2: Creating a SFJ store

1. Open up the terminal and [clone](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the recently created project into your local files.

```shell
git clone vtex-sites/{account-name}.store && cd {local-folder}
```

2. Change into the working directory and install all the dependencies listed within the  `package.json` file.

```shell
cd {store-name}.store/
yarn install
```

3. Open your SFJ project in any code editor of your choosing.

4. Open the `staticPaths.json` file and include your store's static paths (e.g., `/about-us`).

5. Open the `lighthouserc.js` file and include the paths you created in the previous step, as in the following, to test them with Lighthouse.

```js
const urls = ['', '/vintage-phone/p', '/apparel---accessories']
```

>ℹ️ *Now, if you run `gatsby develop`, you'll start a development server and have access to our boilerplate at `http://localhost:8000/`.*

6. Run the following command to generate a production version of your store's website and serve it.

```shell
yarn build && yarn docker:serve
```

>ℹ️ *The command above generates the site and serves it with `docker`. We recommend using `docker` to locally debug a site in production and for receiving more information on possible improvements in performance and bundles.*

>ℹ️ ***Tip:** If you face any issues during development, first consider running `yarn clean` to clean up any corrupted artifacts from a previous build.*

7. Create a new git branch.

```shell
git checkout -b feat/initial-pr
```

8. Make a production build to generate optimized assets.

```shell
yarn clean && yarn build
```

9. Include all files in the PR.

```shell
git add . && git commit -m "Initial Setup" && git push
```

10. Create a PR.

You will now see [our bots](build-pipeline.md) validating your changes. Once all validations are successfully performed, merge the PR.
