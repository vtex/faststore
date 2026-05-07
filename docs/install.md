# Installation

Some internal packages are private and require authentication before they can be installed. This document explains the steps needed to get everything set up.

## 1. Authenticate on AWS CodeArtifact

Go to the [Microsoft My Apps](https://myapps.microsoft.com/) portal.

Ensure that you have access to the `AWS Org (cia)` app in the list, then click on it to navigate to the [AWS Access Portal](https://vtex-accounts.awsapps.com/start/#/). From there, expand the `Cia Brasileira de Tecnologia para E-Commerce` section and click on `Access keys 🔑`.

A modal will appear with your credentials. Copy them and paste into `~/.aws/credentials` using the following format:

```
[default]
aws_access_key_id=****
aws_secret_access_key=********
aws_session_token=************************
```

Next, open the terminal and create an environment variable with an auth token. You will need the AWS CLI installed locally — if you don't have it, follow the instructions [here](#aws-cli-installation).

```bash
export CODEARTIFACT_AUTH_TOKEN=$(aws codeartifact get-authorization-token --domain main --domain-owner 053131491888 --region us-east-1 --query authorizationToken --output text)
```

> **Tip:** Verify that the token is set by printing it with `echo $CODEARTIFACT_AUTH_TOKEN`. It should display your auth token. If nothing is printed, the previous step didn't work — run the raw AWS command below to check for errors:
> ```bash
> aws codeartifact get-authorization-token --domain main --domain-owner 053131491888 --region us-east-1 --query authorizationToken --output text
> ```

## 2. Install dependencies

Now that you are authenticated, run `pnpm install` from the root directory and pnpm will install all packages without errors.

---

## AWS CLI INSTALLATION

### macOS

```bash
brew update && brew upgrade && brew install awscli
```
