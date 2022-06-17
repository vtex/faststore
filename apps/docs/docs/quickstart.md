---
sidebar_position: 3
description: Pick your favorite Static Site Generator and locally run your VTEX store in less than 5 minutes.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quickstart

_Pick your favorite Static Site Generator and locally run your VTEX store in less than 5 minutes_

---

:::info
This guide is for intermediate to advanced developers. For a comprehensive intro to FastStore, head to our [getting started tutorial](/tutorials/fundamentals/0)!
:::

## Step by step

### Step 1. Starting a new FastStore project

Clone the [Base Store](/starters/base) repository into your local files and change to the corresponding working directory.

<Tabs groupId="chosen-framework">
  <TabItem value="nextjs" label="Next.js" default>

```sh
npx degit vtex-sites/nextjs.store mystore.store && cd mystore.store
```

  </TabItem>
  <TabItem value="gatsby" label="Gatsby">

```sh
npx degit vtex-sites/gatsby.store mystore.store && cd mystore.store
```

  </TabItem>
</Tabs>

### Step 2. Installing dependencies

Install dependencies using yarn.

```sh
yarn install
```

### Step 3. Configuring your project settings

Open the `store.config.js` file using the code editor of your choice and set up the config to you store.

1. Replace the`storeId` value with the id of your account.
2. Replace the `storeUrl` and `checkoutUrl` values with the corresponding production URLs of your store.
3. Go to the `lighthouse.pages` property and add the paths of the pages you want to track performance over time.
4. Go to the `cypress.pages` property and add the paths of the pages you want to end-to-end test before each release.

### Step 4. Running your store locally

Start a development server on port 8000.

```sh
yarn develop
```

<img className="rounded shadow-md" src="https://vtexhelp.vtexassets.com/assets/docs/src/yarndevelop___e894f0c697aa7150b53791d8b5099255.gif"/>

Your store will start at a hot-reloading environment at [http://localhost:8000/](http://localhost:8000/). You'll also have access to GraphiQL, a tool that you can use to fetch data and build queries, at [http://localhost:8000/\_\_\_graphql](http://localhost:8000/___graphql).

🎉 _That's all!_ You're now ready to start making changes to your FastStore storefront.
