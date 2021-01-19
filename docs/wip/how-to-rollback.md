>⚠️ ***Warning:** The rollback process will be available when we start using VTEX infrastructure to build images. For now, we suggest using [Netlify](https://docs.netlify.com/configure-builds/get-started/) to build images and its rollback tools.*


# Rollbacks
The SFJ rollback process allows you to react faster in case of trouble by enabling rollbacks to previous deploys through a safe and tested path.
By allowing you to change which deploy is in production, it's also possible, for example, to roll back and reuse older storefront versions and campaigns.
In the following section, you'll learn how to roll back in the SFJ.

# Step by step
## Step 1: Making a safe deploy
In case you need to do a rollback in the future, we always recommend you create a backup branch of the `master` as a security measure. For that, take the following steps:
1. Create a backup branch from the current master:
```
git checkout master
git pull
git checkout -b backup-branch
```
>ℹ️ *In this example, we named the backup branch as `backup-branch`. However, feel free to name it however you want.*
2. Merge your PR. This will automatically trigger a new version to go up.

## Step 2: Rolling back
If for any reason, you need to rollback after a deploy, you can do it safely as now we have a backup branch. 
To roll back to the `backup-branch`, you must send a POST request to SFJ APIs as in the following:

```
curl --location --request POST 'http://builders.vtex.app/' \
--header 'Content-Type: application/json' \
--header 'Authorization: <VTEX IO token>' \
--data-raw '{
    "account": "<account>",
    "action": "rollback",
     "head_commit": {
        "id": "<commit-ID>"
    },
    "repository": {
        "name": "<repository-name>",
        "owner": {
            "login": "vtex-sites"
        }
    },
    "target": {
        "branch": <backup-branch>
    }
}'
```

- `VTEX IO token` -  The necessary authentication code to send requests to VTEX APIs. Run `vtex local token` in the terminal to obtain an exclusive token.
- `account` (string) - The VTEX account name.
- `commit-ID` (string) - The hash that identifies the head commit of the `backup-branch` branch.
- `repository-name` (string)- The name of your store's GitHub project (e.g., `storecomponents.store`).
- `backup-branch` (string) - The backup branch name (e.g., `backup-branch`).

Once you send the POST request, wait for the `201` HTTP status code.

# Modus Operandi
Once the rollback is successfully performed with the `201` HTTP status response, it will trigger a new build from the backup branch. 
>⚠️ *Depending on your store size, the time to replace the build in production can take about 10 minutes.*

If you receive a `202` response – or anything different from `201` – there was a problem (probably authenticating).
You can't perform a rollback in a different account from your token.

If you and you want to go back to the previously `main` version of your store. Than, you need to perform the request:
```
curl --location --request POST 'http://builders.vtex.app/' \
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
>ℹ️ *In this example, the default branch is named `main`. However, many projects have different names for the default branch (one very common name is `master`). This doesn't affect things. When we write `main` branch, we mean the default branch*

If something is pushed to the `main` branch, we understand that this is a new and stable release, so there will be a new production build based on your `main` branch.

In summary, the rollback will last as long as the `main` branch remains untouched.
If you request e rebuild of the code or push to the default branch of your project, a new production build will take place and become the version in production.

## Technical details
You don't need to use the branch `backup-branch`, you can name it however you want.

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

### How much time does it take?
We are working to have a fast rollback, the time may not be longer than 10 minutes.

### How to take security measures? 
Always check the deploy preview before putting a deploy on production. The rollback interaction will invite you to do so. 

### How much time it takes to invalidate caching
We are investigating it by now. 
