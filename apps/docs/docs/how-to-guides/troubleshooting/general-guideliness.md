---
sidebar_position: 0
description: General guideliness on how to debug a FastStore.
tags: 
    - performance
    - troubleshooting
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Troubleshooting FastStore

An e-commerce is a very complex website were multiple scripts and APIs interact. Debugging such system can be challenging, however, we believe there are general guideliness you can follow to pinpoint the exact origin of the error and than work on a fix. 

There are three main sources of errors on FastStore
1. Starter bugs
2. E-commerce provider APIs bugs
3. Customizations bugs. 

Starter bugs are issues present on the starter before you begin your project. Since you start your project with a fork of the starter, all issues are also replicated on your project. 

To figure out if the bug you are facing is a starter bug, it's recommended you:
1. Download the starter
2. Point it to your e-commerce provider
3. Test if the same feature happens on the starter. 

These steps are better covered on our [troubleshooting starter](./starter) guideline. 
If, after following these steps, the issue is reproducable, it means you are facing a starter bug and you may file an issue. If not, maybe you are facing an e-commerce API bug. 

Each e-commerce has a set of public APIs. For instance, VTEX has a [list of rest apis](https://developers.vtex.com/vtex-rest-api/docs/getting-started-list-of-rest-apis) where you can test if the requests are working as expected.

If the API is ok, than probabibly this is an issue on your own code.

If you know your store used to work on the past, you can use a technique called binary search to know when, in time, this bug was introduced and exactly which files changed. Check our [Time machine](./binary-search) guideline for more info.

If this is a new issue and you are not sure this was working before, this is probably an issue on your code. Use [React docs](https://reactjs.org/docs/design-principles.html#debugging) to know where to go from there

The framework, then, for debugging FastStore is:
```md
if is starter bug:
  search on github for similar issues
  if issue is fixed on newer versions:
    backport the fix to your store
  else:
    open an issue at the starter repo
else if is an e-commerce API issue:
  use your e-commerce provider flow for openning a ticket
else if it was working in a point of time:
  bisect your code to know when the bug was introduced
else:
  this is probably an issue in your own project. 
```
