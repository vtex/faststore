---
sidebar_position: 3
---

# Quickstart

*Pick your favorite Static Site Generator and locally run your VTEX store in less than 5 minutes*

---

:::note 
This guide is for intermediate to advanced developers. For a comprehensive intro to FastStore, head to our [getting started tutorial](/tutorials/architecture/0)!
:::

## Start with Gatsby

### Step 1. Starting a new FastStore project

Clone the [`base.store`](https://github.com/vtex-sites/base.store) project into your local files and change to the corresponding working directory.

```sh
npx degit vtex-sites/base.store mystore.store && cd mystore.store
```

### Step 2. Installing dependencies

Install dependencies using yarn.

```sh
yarn install
```

### Step 3. Setting up environment variables

Open the `vtex.env` file using the code editor of your choice and set up the following environment variables:

```shell
GATSBY_STORE_ID={vtexAccount} # Replace with the name of your VTEX account
GATSBY_VTEX_ENVIRONMENT={vtexEnvironment} # Replace with the VTEX environment you'll use to deploy your store. For most cases, use vtexcommercestable.
GATSBY_VTEX_IO_WORKSPACE={vtexWorkspace} # Replace with the name of the VTEX workspace you'll use to develop your store. For most cases, use master.
```

### Step 4. Running your store locally

Start a development server on port 8000.

```sh
yarn develop
```

![](/img/tutorials/gatsby/basestore.gif)

Your store will start at a hot-reloading environment at [http://localhost:8000/](http://localhost:8000/), and you'll also have access to GraphiQL at [http://localhost:8000/___graphql](http://localhost:8000/___graphql), a tool that you can use to fetch data and build queries. 

🎉 *That's all!* You're now ready to start making changes to your FastStore + Gatsby storefront.