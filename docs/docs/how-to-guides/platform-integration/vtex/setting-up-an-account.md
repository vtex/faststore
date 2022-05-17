---
title: Setting up a VTEX account for FastStore
sidebar_position: 1
---

In this guide, you will learn how to setup your **VTEX** account for developing your **FastStore** storefront.

This guide must be done before developing your storefront at VTEX since this some crucial depedencies are installed and configured on this process, like VTEX Intelligent Search, etc.

---

## Before you start

Before proceeding any further, make sure you have access to a **VTEX** account and have already [developed your storefront project with **FastStore**.](/tutorials/gatsby-overview)

---

### Install dependencies to your account
Setups and dependencies are a long and complicated process. To speedup the process, we offer an automatic script that installs and setups all dependencies for you. For running this script, you first need to install, on your local machine, the [VTEX toolbelt](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-vtex-io-cli-installation-and-command-reference).

After installing VTEX toolbelt, install the FastStore plugin by running:
```
vtex plugins install https://github.com/vtex/cli-plugin-faststore
```

After having it installed, login into the account you want to setup:
```
vtex login <account>
```

Then, run and follow the command instructions
```
vtex faststore setup
```

In the end of the process you should see: 
```Happy coding on FastStore 🎉```

## Next steps
The setup script does a big chunk of the setup work. However, some configurations still need manual assesement. Checkout our [hosting guides](/how-to-guides/platform-integration/vtex/hosting-a-faststore-vtex-website) for additional setup.
