## Developing Packages that depend on one another at the same time

1. Run `yarn` at the root of the repo

2. Run `lerna link --force-local` at the root of the repo

3. Run `yarn develop` at each of the packages that depends on the other

## Developing packages while also testing on a store

1. Repeat the steps from the above section

2. Run `yarn link` on the package that you are developing

3. Run `yarn` at the store's repo

4. If the store's repo already have the package that you are developing as a dependency, just run `yarn link {packageName}`

5. If your package is not an npm dependency yet, you can develop locally by referring to your local version of the package on gatsby config.

Example:

```ts
{
  resolve: '/Users/jmgris/work/faststore/packages/gatsby-plugin-pixel-facebook'
}
```
