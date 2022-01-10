---
sidebar_position: 1
---

# Setting up your VTEX account to save Secrets

In this guide, you'll learn how to initially set up your VTEX account so you can later edit the Secrets of your FastStore project.

To set up your account, you will first need to install the WebOps Secrets (WOS) plugin on your VTEX IO CLI. WOS provides great autonomy and easy management over Secrets, besides guaranteeing the safe storage of your Secrets in your FastStore repository. With WOS, Secrets are saved in an encrypted file, which we'll learn how to manipulate later in the [Managing secrets](/how-to-guides/webops/secrets/managing-secrets) doc.

## Before you start

Before proceeding any further with this guide, make sure you have: 

- Installed the VTEX IO CLI on your machine. Please refer to [this](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-install) document for more information.
- Cloned your FastStore project into your local files.

## Step by step

### Step 1 - Installing the Secrets plugin

1. Open the terminal and log in to your VTEX account using the VTEX IO CLI.
    ```sh
    $ vtex login {account-name}
    ```

    :::caution
    ️Replace the value between curly braces according to your scenario.
    :::

2. Install the Secrets plugin by running the following command.

    ```sh
    vtex plugins install webops-secrets
    ```

3. Run `vtex secrets` to ensure the installation of the Secrets plugin was successful and check its all three subcommands.
   
   ![Secrets plugin](/img/how-to-guides/vtex-secrets.png)

### Step 2 - Setting up your VTEX account to accept secrets

1. Change the current directory to your FastStore’s repository root.
2. In the root of your project, create the `vtex.env` file and keep it empty. 
   - Skip this step if your project already has the `vtex.env` file.
   
   ```sh
   touch vtex.env
   ```
   
3. Now, run the following command to configure your VTEX account and your FastStore project to be able to save Secrets.

    ```sh
    vtex secrets setup
    ```

    ![Secrets Setup](/img/how-to-guides/secrets.gif)

After running the `vtex secrets setup` command, the `secrets.revealed.json` file will be created in the root of your repository. Also, the `.gitignore` file will be updated with the `secrets.revealed.json` file to avoid any risks of exposing your Secrets by mistake on the remote repository.

Now that your VTEX account and your FastStore project are ready to receive secrets, check the [Managing secrets](/how-to-guides/webops/secrets/managing-secrets) doc to learn how to encrypt and decrypt the Secrets file.