---
sidebar_position: 2
---

# Managing secrets

To manage your FastStore Secrets, you'll use the WebOps Secrets plugin to encrypt and decrypt the Secrets file. When decoded, the secrets file is stored as `secrets.revealed.json` and anyone can see and understand the decrypted key-value pairs of your Secrets—once encrypted, the secrets file extension changes to `secrets.hidden.json`, and every Secret becomes unpredictable and unique.

After committing your code changes into the repository, VTEX IO WebOps will be able to access the `secrets.hidden.json` file, decrypt and consume your secrets as environment variables so the build process can proceed.

![Hide and reveal secrets](/img/how-to-guides/hide-reveal-secrets.gif)

## Before you start

Before proceeding any further with this guide, make sure you have performed the initial setup needed to manage your store secrets. If you're not sure about this prerequisite, check for the `secrets.revealed.json` file at the root of your FastStore project.

For more information, please refer to [Setting up the secrets file](/how-to-guides/webops/security/setting-up-secrets).

## Step by step

### Step 1 - Editing your store secrets

1. Open your FastStore project in any code editor of your choice.
2. Open the `secrets.revealed.json` file. Notice that the `account` and its encryption-decryption key alias are already defined in the `secrets.revealed.json` file.
3. According to your scenario, add, modify or delete secrets in the `secrets.revealed.json` file. Notice that secrets must be defined as key-value items as in the following example:
   
    ```json
    {
        "account": "account-name",
        "name of the secret": "value of the secret"
    }
    ```

    :::caution
    Do not remove the `account` item from the `secrets.revealed.json` file since this information is necessary to build the store.
    :::

### Step 2 - Hiding your store secrets

After editing your secrets, you must hide them. By encrypting your secrets, you will be able to commit your changes and push them into your remote repository safely.

To encrypt your secrets, run the following command:

```sh
vtex secrets hide
``` 

That's all! Now you can commit and push your changes to your remote repository. 

Notice that whenever you need to update your Secrets, you must run `vtex secrets reveal` to first decrypt them. The Secrets file extension will change back to `secrets.revealed.json` and you'll be able to edit it. Once you finish your changes, you must run `vtex secrets hide` again. 
