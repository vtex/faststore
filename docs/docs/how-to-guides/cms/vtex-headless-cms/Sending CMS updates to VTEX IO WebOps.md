# Sending CMS updates to VTEX IO WebOps

If you are developing your FastStore project with WebOps and VTEX Headless CMS, you must ensure that WebOps is aware of every CMS update performed via the VTEX Admin. To do so, you must configure the WebOps webhooks responsible for communicating with the VTEX Headless CMS as in the following step by step.

## Step by step

1. Open your FastStore project in any code editor of your preference.
2. Create the `cms-webhook-urls.json` file in the root directory of your project. 
3. Add the webhooks corresponding to your store website as in the following:
   ```json title="cms-webhook-urls.json"
   {
      "urls": [ "https://{account}.myvtex.com/cms-releases/webhook-releases"]
   }
   ```

   :::caution
   If applicable, specify the [production workspace](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-workspace) you are using to develop your FastStore project in the webhook URL as in the following: `https://{workspace}--{account}.myvtex.com/cms-releases/webhook-releases`
   :::

4. Open a Pull Request including the previous changes.
5. Merge the Pull Request.

Now, if you request to publish a page via the VTEX Headless CMS, WebOps will rebuild your store website and, if successful, change the status of your draft to **Published**.