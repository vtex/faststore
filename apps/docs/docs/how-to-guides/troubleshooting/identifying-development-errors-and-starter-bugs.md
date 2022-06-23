---
sidebar_position: 1
description: Check if you are facing a bug from the Starter.
tags:
  - performance
  - troubleshooting
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Identifying development errors and Starter bugs

While developing with FastStore, you may run into errors. Some of these may require fixes in FastStore libraries, while others may require adjusting your code.

Hence, before proceeding with any advanced troubleshooting, we recommend that you first check if you are facing a bug from FastStore/WebOps or a mistake on your side.

## Step by step

1. Open the terminal and clone the [Base Store](/starters/base) repository.

<Tabs groupId="chosen-framework">
  <TabItem value="nextjs" label="Next.js" default>

```sh
npx degit vtex-sites/nextjs.store
```

  </TabItem>
  <TabItem value="gatsby" label="Gatsby">

```sh
npx degit vtex-sites/gatsby.store
```

  </TabItem>
</Tabs>

2. Change to the cloned repository and run `yarn`.

<Tabs groupId="chosen-framework">
  <TabItem value="nextjs" label="Next.js" default>

```sh
cd nextjs.store && yarn
```

  </TabItem>
  <TabItem value="gatsby" label="Gatsby">

```sh
cd gatsby.store && yarn
```

  </TabItem>
</Tabs>

3. Open the `store.config.js` file and update the value of the `storeId` field with the account name of your store.

   ```diff
    module.exports = {
    platform: 'vtex',

     api: {
   +    storeId: {account}
        environment: 'vtexcommercestable'
     }
    }
   ```

4. Start a local server.
   ```
   yarn develop
   ```
5. Access [http://localhost:8000/](http://localhost:8000/) and test the features you are having trouble with.

If the problem persists with the Base Store starter, we recommend [opening an issue](https://github.com/vtex/faststore/issues/new/choose) and reporting the problem. However, if the error only occurs in your own project, please refer to the [Tracing the error source](/how-to-guides/troubleshooting/tracing-the-error-source) guide to continue debugging your store.
