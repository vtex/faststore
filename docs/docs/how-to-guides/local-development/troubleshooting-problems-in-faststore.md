---
tags: 
    - performance
    - troubleshooting
---

# Troubleshooting problems in Faststore

While developing with FastStore, you may run into errors. Some of these may require fixes in FastStore libraries, while others may require adjusting your code. 

Hence, before proceeding with any advanced troubleshooting, we recommend that you first check if you are facing a bug from FastStore/WebOps or a mistake on your side.

## Step by step

1. Open the terminal and clone the [`base.store`](https://github.com/vtex-sites/base.store) repository.
    ```
    npx degit vtex-sites/base.store
    ```
2. Change to the cloned repository and run `yarn`.
    ```
    cd base.store && yarn
    ```
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

If the problem persists with the `base.store` starter, we recommend [opening an issue](https://github.com/vtex/faststore/issues/new/choose) and reporting the problem. However, if the error only occurs in your own project, please refer to recommended resources (*Comming Soon*) to dive deeper into your code and try to find the origin of the error.