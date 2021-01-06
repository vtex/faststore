## Steps of the pipeline
Store Framework Jamstack CI flow consists 4 main steps: `Build`, `SonarQube`, `Integration Tests` and `Lighthouse CI`. 

/* add image of the CI steps flow*/


This flow is triggered by two situations:
1. When a pull request is created.
2. When a push with commits associated to a pull request is made.

When this happens, a `check suite` is created and populated with `check runs` that shows the state of each step.  
The initial state of each step is `queued`. This indicates that soon they will be executed.

/* add image of all the steps on `queued`*/


## Build

This step is reponsible of two main things:

### Build the store
- Run an automated build for the store, saving all the generated artifacts in our infrastructure.
- Send the build logs to GitHub.
The build logs are visible by clicking on `details` on the `Build` check run once its completed.
/* add image of the build check completed */

#### Possible states
- `queued`: soon this step will be executed.
- `in_progress`: this step is being executed.
- `completed/success`: the build is completed successfuly.
- `completed/failure`: the build is completed but something went wrong.

### Generate a deploy preview 
For each pull request we provide a `Deploy Preview` that is a deploy of the most recent changes of the pull request.
You can access the `Deploy Preview` of a specific Pull Request by clicking on `details` on the commit status with the title `<your store>/deploy-preview`:  
/* add image of the deploy preview button */  

Or directly on this url: `https://preview-<pull request number>--<your store name>.vtex.app/`.  
For example: `https://preview-417--storecomponents.vtex.app/`.


## SonarQube

### Execute sonarQube scan

### Mark the issues as annotations on the pull request



## Lighthouse CI

### Run LHCI





## Integration Tests

### Execute integration tests

### Add the results to the check run body

