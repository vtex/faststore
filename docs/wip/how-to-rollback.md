## ⚠️ Warning: this will only work when we start using VTEX infrastructure to build the images. Is also possible to build with Netlify[] — for rollback in Netlify, you can use its tools.


# The rollback
The rollback interaction aims to help you to react faster when having trouble, changing the deploy that is on production through a safe and tested path. This also allows you to reuse older versions of a storefront, for a recurrent store's campaign for example. 

# 📚 Step by step on how to rollback
This document is the first version of a guide for the rollback process using VTEX Store Framework Jamstack. It also explains the rollback expected behavior.
We'll start showing how to make a safe deploy — one that is ready to be used for a rollback.

## 👮‍♀️ How to make a safe deployment (Security Measures)
- Create a new branch from the current master (this is a backup branch):
```
git checkout master
git pull
git checkout -b backup-branch
```
- Merge your PR, this will trigger a new version to go up.

## 🔙 Rolling back
If you need to rollback after a deploy, you now have a backup branch named `backup-branch`. 
An example curl is presented below:
```
curl --location --request POST 'http://builders.staging-2a.ingress.vtex.io' \
--header 'Content-Type: application/json' \
--header 'Authorization: <VTEX IO token>' \
--data-raw '{
    "account": "<account>",
    "action": "rollback",
     "head_commit": {
        "id": "<commit ID>"
    },
    "repository": {
        "name": "<repository Name>",
        "owner": {
            "login": "vtex-sites"
        }
    },
    "target": {
        "branch": "backup-branch"
    }
}'
```

- You can get the `VTEX IO token` in the toolbelt, running the command `vtex local token`;
- The `commit ID` is the hash that identifies the head commit of the branch `backup-branch`;
- The repository name is the name of your store's GitHub project, for example `storeName.store`.

Wait for the `2xx` reponse.

# Expected Behavior
When the rollback is performed with a `2xx` status response, it triggers a new build of your store from the branch `backup-branch`.
Because of that, the time to replace the current store can take about 10 minutes, depending on the size of your store.

All the subsequent production builds of your store will be based on that commit from the `backup-branch`.
Let's suppose you where fixing a bug, than after finishing it you and you want to go back to the previously `main` version of your store. Than, you need to perform the request:
```
curl --location --request POST 'http://builders.staging-2a.ingress.vtex.io' \
--header 'Content-Type: application/json' \
--header 'Authorization: <VTEX IO token>' \
--data-raw '{
    "account": "<account>",
    "action": "rollback",
     "head_commit": {
        "id": "<commit ID>"
    },
    "repository": {
        "name": "<repository Name>",
        "owner": {
            "login": "vtex-sites"
        }
    },
    "target": {
        "branch": "main"
    }
}'
```
If your default branch is called `master` instead of `main`, this will perform a production build with the code in the `main` branch.
It will also allow new builds from the `main` branch everytime a merge happens.

## Technical details
You don't actually need to use the branch `backup-branch`, you can name it however you want.

There is the possibility of the url `http://builders.staging-2a.ingress.vtex.io` changing due to infrastructure updates.

For better clarity, here is the format of the body:
```
{
    "account": string,
    "action": "rollback",
    "head_commit": {
        "id": string
    },
    "repository": {
        "name": string,
        "owner": {
            "login": "vtex-sites"
        }
    },
    "target": {
        "branch": string
    }
}
```

# FAQ

### How much time it takes?
We are working to have a fast rollback, the time may not be longer than 10 minutes.

### How to take security measures? 
Always check the deploy preview before putting a deploy on production. The rollback interaction will invite you to do so. 

### How much time it takes to invalidate caching
We are investigatig it by now. 
