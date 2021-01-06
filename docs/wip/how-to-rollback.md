## ⚠️ Warning: this will only work when we start using our infrastructure to build the images (not netlify)

# 📚 Step by step on how to rollback?

In this document, we'll guide you through a rollback process and explain the expected behavior.

This is a first version, we expect to provide a better experience in the future.

Before we start talking about the rollback, we'll say how to make a safe deploy, a deploy that is ready to perform a rollback

## 👮‍♀️ How to make a safe deploy (Security Measures)
- Create a new branch from the current master (this is a backup branch):
```
git checkout master
git pull
git checkout -b backup-branch
```
- Merge your PR, this will trigger a new version to go up:

## 🔙 Rolling back
If you need to rollback after the deploy, we now have a backup branch named `backup-branch`. An example curl is presented below:
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

The `VTEX IO token` is the one you get in the toolbelt with the command `vtex local token`.
The `commit ID` is the hash that identifies the head commit of the branch `backup-branch`.
The repository name is the name of your store's GitHub project, probably something in the format `storeName.store`.

Wait for the `2xx` reponse.

- How much time it takes?
- security measures

- How the rollback works with dynamic and static data?
- Caching? How much time it takes to invalidate caching


# Expected Behavior
When the rollback is performed with a `2xx` status response, it will trigger a new build of your store from the branch `backup-branch`.
Because of that, the time to replace the current store can take about 10 minutes, depending on the size of your store.

All the subsequent production builds of your store will be based on that commit from the `backup-branch`.
Once the bug is fixed, to go back to the `main` version of your store, you need to perform the request:
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
Perhaps your default branch is called `master` instead of `main`.
This will perform a production build with the code in the `main` branch.
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
