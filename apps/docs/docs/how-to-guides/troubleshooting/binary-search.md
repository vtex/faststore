---
sidebar_position: 2
description: Find where in time the bug was introduced
tags: 
    - performance
    - troubleshooting
---

# Time Machine

This debugging process is helpful if you are sure the issue you are facing now didn't exist in the past, and you want to find where in time and which changes to the code made this new bug emerge.

## How it works

FastStore development workflow is Git-based. This means that, for each release, the developers have to create a commit on the `main` branch of the store. 
This generates a release timeline, allowing you to go back on previous versions, making it possible to test if the issue still happens. If you know that, at some point in time, this issue was not there, you will certainly find the version of your store this issue was introduced and you are able to tell exactly which files changed.

Going back in time, version by version, can be time-consuming and a strategy called `binary search` can be used to speed up the process of finding the right version. Hopefully, the Git team embedded this strategy into a feature called `bisect`. Below, we give you a step-by-step on how to use `git bisect` with FastStore.

## Step by Step

1. First, we need to find the hash of a commit that we know the app was working. Open a terminal on your project's root and then:
```sh
git log
```

This should output a timeline of your repo. 

2. Go back to a commit you know worked. Copy this commit's hash and run
```
git bisect start HEAD <commit-hash-that-worked>
```

Git will automatically go back in time for you. Now, you can test with 
```
yarn && yarn develop
```

If it works, type on the terminal:
```
git bisect good
```

Otherwise 
```
git bisect bad
```

After a few iterations, Git will find the bad version for you.
After finding this version, you can use `git diff` to figure out the changes that made this issue appear.
