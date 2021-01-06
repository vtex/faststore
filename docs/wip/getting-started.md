# Getting started 

At the end of this tutorial, you will have your VTEX store running our basic SFJ theme at `http://{account}.vtex.app`.

## Requirements

Before you start building your very first SFJ store, please make sure:

- You have a GitHub account.
- Your VTEX account is part of the [VTEX Sites](https://github.com/vtex-sites) organization.
- You're comfortable using [Git commands](https://git-scm.com/docs).
- You know what [Jamstack]() is.
- You're familiar with [Gatsby's]() core concepts.
- You know what [GraphQL](https://graphql.org/) is and its basic concepts.
- You know how to develop [React](https://reactjs.org/) components.

## Tools

To build an SFJ store, we'll make use of different technologies and frameworks. Therefore, before proceeding any further, make sure you have the following tools installed in your machine:

- [Node.js](https://nodejs.org/en/), a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Yarn](https://yarnpkg.com/), a package manager for your code that allows you to use and share code with other developers from around the world.
- [Gatsby](https://www.gatsbyjs.com/docs/quick-start/), a React-based open-source framework for creating websites and apps. 
- [Toolbelt](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-toolbelt), a command-line interface that provides all the necessary features to start developing apps with VTEX IO. 

## Setting up your development environment

1. Open up the terminal and log in to your VTEX account.

```shell
vtex login {account}
```

2. Run the following command to install all the necessary apps to start developing with the SFJ.

```shell
vtex install vtex.admin-search@1.x vtex.admin-cms@0.x vtex.graphql-gateway@0.x
```

3. [Create a new repository from this template](https://github.com/vtex-sites/storecomponents.store) inside the [`vtex-sites` organization.](https://github.com/vtex) with the name `{account}.store`.

### Connecting to the VTEX CMS

>⚠️ *If you're not using the VTEX CMS, please, instead of taking the following steps, head to the [Gatsby Plugins](https://www.gatsbyjs.com/plugins/) reference and look for your current CMS in their plugin library. Open the `package.json` file of the recently created repository, replace `@vtex/gatsby-plugin-cms` with the name of your CMS plugin, and follow the instructions found on Gatsby website. Notice that if you can't find a corresponding plugin, consider [creating]() your own.*

1. Follow [this tutorial](https://developers.vtex.com/vtex-developer-docs/docs/getting-started-authentication#creating-the-appkey-and-apptoken) to create a new `appKey`/`appToken`.
2. Copy the generated token to your clipboard.
3. Open your VTEX account admin on your browser and go to *Account management > Access profiles*.
4. Create a new profile with the `SFJ CMS` name and configure the following products:

- Dynamic Storage
    - Full access in all documents.
    - Read only documents.
- CMS
    - CMS GraphQL API.
5. Save the new  profile.
6. Associate the created access profile with the `appKey / appToken key` previously generated.

>⚠️ ***Keep in mind:** These `appkey`/`apptoken` must be related only to the `SFJ CMS` profile.*

7. Set the `appKey`/`appToken`  to the following environment variables in the CI/CD environment of your choosing:

```
VTEX_CMS_APP_KEY={appKey}
VTEX_CMS_APP_TOKEN={appToken}
```

>ℹ️ *If you are using [Netlify](https://www.netlify.com/) as a CI/CD, you can [set these environment variables directly on the Netlify panel.](https://docs.netlify.com/configure-builds/environment-variables/#declare-variables)*

>⚠️ *If you are using the VTEX CI/CD, you won't be able to set up environment variables by API or dashboard. Please, contact us for more information.*

### Creating a SFJ store

1. Open up the terminal and [clone](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/cloning-a-repository) the recently created project into your local files.

```shell
git clone vtex-sites/{account-name}.store && cd {local-folder}
```

2. Change into the working directory and install all the dependencies listed within the  `package.json` file.

    ```shell
    cd {store-name}.store/
    yarn install
    ```

>ℹ️ *Now, if you run `gatsby develop`, you'll start a development server and have access to our boilerplate at `http://localhost:8000/`.*

3. Run the following command to generate a production version of the website and serve it.

```shell
yarn build && yarn docker:serve
```

>ℹ️ *The command above generates the site and serves it with `docker`. We recommend using `docker` to locally debug a site in production and for more information on possible improvements in performance and bundles.*

>ℹ️ ***Tip:** If you face any issues during development, first consider running `yarn clean` to clean up any corrupted artifacts from a previous build.*

4. Create a new git branch.

```shell
git checkout -b feat/initial-pr
```

5. Make a production build to generate optimized assets.

```shell
yarn clean && yarn build
```

6. Include all files in the PR.

```shell
git add . && git commit -m "Initial Setup" && git push
```

7. Create a PR.

You will now see [our bots]() validating your changes. Once all validations are successfully performed, merge the PR.
