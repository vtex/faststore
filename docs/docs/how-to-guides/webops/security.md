---
pagination_prev: null
---

# Security 

When developing your FastStore project, you may use private services and dependencies that require credentials and passwords to build your store website. Thus, you may not want this information to be exposed and kept unsafe in your remote repository. At the same time, you may want this data to be easily accessible, so you can change and update it whenever you desire. To address this case, VTEX IO WebOps provides the Secrets API.

## Secrets

A **Secret** is an API object used to hold confidential data, such as credentials, passwords, and tokens that access private APIs and dependencies necessaries for your store build. Henceforth, you can use Secrets to avoid exposing sensitive data in your **FastStore** code. 

Secrets are encrypted and saved directly in the **VTEX IO WebOps** infrastructure, guaranteeing the safe storage of your data. **VTEX IO WebOps** then decrypts and consumes your Secrets as environment variables to build your store.

![](/img/how-to-guides/secrets-diagram.png)

To manage your Secrets, you'll use a **VTEX IO CLI** plugin called **WebOps Secrets (WOS)**, which allows you to:
- Set up your **VTEX account** to save Secrets.
- Encrypt the Secrets file.
- Decrypt the Secrets file.

Please refer to the following docs to learn more about Secrets:

1. [Setting up your VTEX account to save Secrets](/how-to-guides/webops/security/setting-up-secrets)
2. [Managing secrets](/how-to-guides/webops/security/managing-secrets)