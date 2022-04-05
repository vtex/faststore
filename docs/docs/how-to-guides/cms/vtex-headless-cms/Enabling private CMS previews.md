# Enabling private CMS previews

By default, the VTEX Headless CMS publishes previews of your store website to public URLs. However, if, for privacy reasons, you prefer to keep your website previews hidden from the general public, you can do so by following the steps outlined in this article.

## Before you start

To complete this guide, you must have the VTEX IO CLI installed in your machine. For more information, please refer to [this document](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-install).

---

## Step by step

1. Open the terminal and log in to your VTEX account. 
   *Remember to replace the values between curly brackets according to your scenario.*
    
   ```
   vtex login {account}
   ```

   :::caution
   If applicable, change to the [production workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-workspace) you are using to develop your FastStore project.
   :::

2. Install the `vtex.faststore-auth` app in your account.
    ```
    vtex install vtex.faststore-auth
    ```
3. Now, open your FastStore project in any code editor of your preference and add the following flag to your `vtex.env` file:
   ```diff {9} title="vtex.env"
     # configures Gatsby
     GATSBY_CPU_COUNT=4
     ENABLE_GATSBY_REFRESH_ENDPOINT=true

     # configures WebOps
     USE_NODE_MODULES_CACHE=true
     USE_GATSBY_CACHE=false

   + USE_CMS_PREVIEW_AUTH=true
   ```    
4. Open a Pull Request including the previous changes.
5. Merge the Pull Request.

Once the build completes, only VTEX users with access to your store domain will be able to visualize your new CMS previews.