## Developing Packages that depend on one another at the same time

1. Run a `yarn` at the root of the repo

2. Run `lerna link --force-local` at the root of the repo

3. Run `yarn develop` at each of the packages that depends on the other
