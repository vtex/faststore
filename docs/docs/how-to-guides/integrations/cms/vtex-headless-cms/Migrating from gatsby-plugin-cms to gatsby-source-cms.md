import Tabs from '@theme/Tabs'
import TabItem from '@theme/TabItem'

# Migrating from gatsby-plugin-cms to gatsby-source-cms

This guide is intended for those who integrated their FastStore project with the VTEX Headless CMS using the `gatsby-plugin-cms`. This plugin was deprecated in favor of the `gatsby-source-cms` plugin on 3 January 2022.

The newer `gatsby-source-cms` plugin uses a dedicated API to fetch the content from the VTEX Headless CMS. This plugin also lets you use the [Gatsby Preview Server](https://www.gatsbyjs.com/docs/how-to/local-development/running-a-gatsby-preview-server/) to build and preview your pages before publishing them.

---

## Before you start

To complete this guide, you must have the VTEX IO CLI installed in your machine. For more information, please refer to this [document](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-install).

---

## Step by step

### Step 1 - Uninstalling the deprecated plugin

Before proceeding any further, make sure to uninstall the deprecated `gatsby-plugin-cms` from your FastStore project. 

1. Open the terminal and **change to the root directory of your FastStore project.** 
2. Remove the `gatsby-plugin-cms` plugin from your project by running the following command:

    ```bash
    yarn remove @vtex/gatsby-plugin-cms
    ```

3. Also, remove the files related to the deprecated `gatsby-plugin-cms` plugin:

    ```bash
    rm -rf ./src/@vtex/gatsby-plugin-cms/
    ```

### Step 2 - Installing the `gatsby-source-cms` plugin

Now that you have uninstalled the deprecated plugin, you're ready to install the newer `gatsby-source-cms` plugin.

1. Install the `gatsby-source-cms` plugin by running the following command in the root directory of your FastStore project:

   ```bash
   yarn add @vtex/gatsby-source-cms
   ```

2. Open the `gatsby-config.js` file and update it to fetch the CMS pages using the new Gatsby plugin as in the following:

    ```diff
    -{
    -  resolve: '@vtex/gatsby-plugin-cms',
    -  options: {
    -    tenant: account,
    -    workspace,
    -    environment,
    -  },
    -},

    +{
    +  resolve: '@vtex/gatsby-source-cms',
    +  options: {
    +    workspace, // workspace you're using to develop or master
    +    tenant: account, // the name of your VTEX account 
    +  },
    +},
    ```

### Step 3 - Recovering Content Types, Sections and Translation Keys

Now, it's time to set up the folder structure necessary for the `gatsby-source-cms` plugin to function and recover your Content Types, Sections, and Translation Keys definitions.

1. Create a new folder called `cms` in the root directory of your project:
   
   ```bash
   mkdir cms
   ```

2. Save your Content Types, Sections, and Translation Keys in the `cms` folder by running the command corresponding to your operating system and after replacing the value between curly brackets (`{account}`) with your account name.

<Tabs
defaultValue="macos"
values={[
{label: 'MacOs', value: 'macos'},
{label: 'Windows', value: 'windows'},
{label: 'Linux', value: 'linux'},
]}>
<TabItem value="macos">

```bash
curl https://{account}.vtex.app/page-data/_cms/sections.json -o ./cms/sections.json
curl https://{account}.vtex.app/page-data/_cms/content-types.json -o ./cms/content-types.json
curl https://{account}.vtex.app/page-data/_cms/translation-keys.json -o ./cms/translation-keys.json
```

</TabItem>
<TabItem value="windows">

```bash
# save each schema on it's own file
# remember to replace {account} with your account name
wget https://{account}.vtex.app/page-data/_cms/sections.json -O ./cms/sections.json
wget https://{account}.vtex.app/page-data/_cms/content-types.json -O ./cms/content-types.json
wget https://{account}.vtex.app/page-data/_cms/translation-keys.json -O ./cms/translation-keys.json
```

</TabItem>

<TabItem value="linux">

```bash
# save each schema on it's own file
# remember to replace {account} with your account name
wget https://{account}.vtex.app/page-data/_cms/sections.json -O ./cms/sections.json
wget https://{account}.vtex.app/page-data/_cms/content-types.json -O ./cms/content-types.json
wget https://{account}.vtex.app/page-data/_cms/translation-keys.json -O ./cms/translation-keys.json
```
</TabItem>
</Tabs>

Now, look for the `sections.json`, `content-types.json`, and `translation-keys.json` files inside the `cms` folder and check if they are not blank. If you notice that any of these files are blank, check if you ran the correct command, guaranteeing that the URL and your account name were right.

### Step 3 - Adapting your schemas and queries

Even though you can reuse most of your Content Type, Section, and Translation Key definitions, you might need to adapt some of your schemas and queries to guarantee that the migration will be successful.

1. Open the terminal and run `yarn develop` to start a local development server.
2. Open the Graph*i*QL IDE ([http://localhost:8000/__graphql](http://localhost:8000/__graphql)) and test your old queries, making sure they are compatible with the `gatsby-source-cms` plugin. Notice that you may need to adapt some queries to use `data` instead of `props`.
3. If necessary, open your project and update the GraphQL queries used in your components.

### Step 4 - Syncing your changes

You can now sync your Content Type, Section, and Translation Key definitions with your VTEX account. This will allow you to see your definitions in the VTEX Headless CMS via the Admin interface.

1. Open the terminal and log in to your VTEX account.
   - *Replace the value between curly brackets according to your scenario.*
   
    ```bash
    vtex login {account}
    ```

2. Create a new development workspace to test your Content Types, Sections and Translation Keys locally.
   - *Replace the value between curly brackets according to your scenario.*

    ```bash
    vtex use {workspace}
    ```

3. Install the VTEX Headless CMS plugin for the VTEX IO CLI:

    ```bash
    vtex plugins install cms
    ```

4. Sync your changes in the `cms` folder with your VTEX workspace by running the following command:

    ```bash
    vtex cms sync
    ```

    :::info
    Use the `--watch` argument to automatically sync your changes with the VTEX Headless CMS app while developing your schemas as in the following: `vtex cms sync --watch`.
    :::

---

## Troubleshooting

If you start a development server (`yarn develop`) and come across the following error:

```
[gatsby-plugin-graphql] GraphQLError [Object]: Unknown field 'fields' on type 'StoreCollection'
```

try migrating your queries to fetch your store collections.

---

## Related resources

- Gatsby Docs: [Running a Gatsby Preview Server](https://www.gatsbyjs.com/docs/how-to/local-development/running-a-gatsby-preview-server/)