---
id: 5
sidebar_label: "5. Promoting your changes"
---

# Part 5: Promoting your changes

## Introduction

Congratulations, by now, you already have your FastStore project integrated with the VTEX Headless CMS! In this last part of this tutorial, let's guarantee you promote your changes to production.

## Step by step

### Step 1 - Publishing your FastStore project

After adapting your `pages` components and querying for the CMS data, open a Pull Request and merge it to `master`.

### Step 2 - Syncing your changes

Now, if you are happy with your Content Type, Section and Translation Keys definitions, you can put them on production by taking the following steps:

1. Open the terminal and switch to the master workspace.
   ```sh
   vtex use master
   ```
2. Change to the root directory of your FastStore project and sync your changes in the `cms` folder with the VTEX Headless CMS app.
   ```sh
   vtex cms sync
   ```

🎉 Congratulations! Your FastStore project is now completed integrated with the VTEX Headless CMS, and editors will now have the autonomy to create, edit, and publish web content via the VTEX Admin with the VTEX Headless CMS app.

## See more

- [VTEX Headless CMS API Reference](/vtex-headless-cms-api)